import React, { useState, useEffect } from 'react';
import { useNavigate } from '@/app/lib/router';
import { Layout } from '@/app/components/Layout';
import { Camera, Instagram, Music, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../api/seller-profile';
import { useSellerProfileQuery } from '@/app/hooks/useApiQueries';

type ProfileFormState = {
  name: string;
  description: string;
  telegramLink: string;
  instagram: string;
  tiktok: string;
  campusLocation: string;
  mainPhone: string;
  secondaryPhone: string;
  categoryId: string;
  logo: string;
  imageFile?: File;
};

export function ShopProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const profileQuery = useSellerProfileQuery();
  const [profile, setProfile] = useState<ProfileFormState | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-profile'] });
      const shopId = profileQuery.data?.data?.profile?.shop?.id;
      if (shopId) {
        queryClient.invalidateQueries({ queryKey: ['shop-detail', shopId] });
      }
    },
  });

  useEffect(() => {
    const apiProfile = profileQuery.data?.data?.profile;
    if (!apiProfile || isDirty) return;

    setProfile({
      name: apiProfile.shop.shopName || '',
      description: apiProfile.shop.bio || '',
      telegramLink: apiProfile.telegram || '',
      instagram: apiProfile.instagram || '',
      tiktok: apiProfile.tiktok || '',
      campusLocation: apiProfile.campusLocation || '',
      mainPhone: apiProfile.mainPhone || '',
      secondaryPhone: apiProfile.secondaryPhone || '',
      categoryId: apiProfile.shop.categoryId || '',
      logo: apiProfile.shop.profileImage || '/default-shop.png',
    });
  }, [profileQuery.data, isDirty]);

  const updateField = (patch: Partial<ProfileFormState>) => {
    setIsDirty(true);
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, ...patch };
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      await mutation.mutateAsync({
        shopName: profile.name,
        description: profile.description,
        campusLocation: profile.campusLocation,
        mainPhone: profile.mainPhone,
        secondaryPhone: profile.secondaryPhone,
        instagram: profile.instagram,
        telegram: profile.telegramLink,
        tiktok: profile.tiktok,
        //profileImage: profile.profileImagePublicId ? [profile.profileImagePublicId] : undefined,
        profileImage: profile.imageFile ? [profile.imageFile] : undefined,
        agreedToRules: true,
      });
      setIsDirty(false);

      alert("Profile updated successfully!");

      const updatedLogo = profile.logo;
      window.dispatchEvent(
        new CustomEvent("shop-updated", { detail: { logo: updatedLogo } })
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const isInitialLoading = !profile && profileQuery.isLoading;
  const hasError = !profile && profileQuery.isError;

  if (isInitialLoading) {
    return (
      <Layout title="Shop Profile" showBack>
        <div className="px-4 py-6 space-y-4">
          <div className="flex flex-col items-center">
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </Layout>
    );
  }

  if (hasError) {
    return (
      <Layout title="Shop Profile" showBack>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="text-red-500">Failed to load profile.</p>
          <Button
            className="flex items-center gap-2"
            onClick={() => profileQuery.refetch()}
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  if (!profile) return null;

  return (
    <Layout title="Shop Profile" showBack>
      <div className="px-4 py-6 pb-24">
        {/* Logo Upload */}
        <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
          <div className="relative">
            <img
              src={profile.logo}
              alt="Shop logo"
              className="w-20 h-20 rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
              <Camera className="w-3.5 h-3.5 text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                aria-label="Upload shop logo"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const previewUrl = URL.createObjectURL(file);
                  updateField({ logo: previewUrl, imageFile: file });

                  try {
                    await mutation.mutateAsync({
                      profileImage: [file],
                      shopName: profile.name,
                      description: profile.description,
                      campusLocation: profile.campusLocation,
                      mainPhone: profile.mainPhone,
                      secondaryPhone: profile.secondaryPhone,
                      instagram: profile.instagram,
                      telegram: profile.telegramLink,
                      tiktok: profile.tiktok,
                      agreedToRules: true,
                    });

                    window.dispatchEvent(
                      new CustomEvent("shop-updated", { detail: { logo: previewUrl } })
                    );
                  } catch (err) {
                    console.error('Failed to upload profile image:', err);
                  }
                }}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tap to change logo
          </p>
        </div>

        {/* Shop Name */}
        <div className="mb-4">
          <Label htmlFor="shopName" className="text-sm font-medium text-gray-900 mb-2 block">
            Shop Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="shopName"
            value={profile.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField({ name: e.target.value })}
            className="h-11 text-base"
            placeholder="Enter shop name"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <Label htmlFor="description" className="text-sm font-medium text-gray-900 mb-2 block">
            Description
          </Label>
          <Textarea
            id="description"
            value={profile.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField({ description: e.target.value })}
            className="min-h-20 text-base resize-none"
            placeholder="Tell customers about your shop"
          />
        </div>

        {/* Campus location */}
        <div className="mb-4">
          <Label>Campus Location</Label>
          <Input
            value={profile.campusLocation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField({ campusLocation: e.target.value })}
          />
        </div>

        {/* Main Phone */}
        <div className="mb-4">
          <Label>Main Phone</Label>
          <Input
            value={profile.mainPhone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField({ mainPhone: e.target.value })}
          />
        </div>

        {/* Secondary Phone */}
        <div className="mb-4">
          <Label>Secondary Phone</Label>
          <Input
            value={profile.secondaryPhone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField({ secondaryPhone: e.target.value })}
          />
        </div>

        {/* Telegram Link */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <Label htmlFor="telegram" className="text-sm font-medium text-gray-900 mb-2 block">
            Telegram Link <span className="text-red-500">*</span>
          </Label>
          <Input
            id="telegram"
            value={profile.telegramLink}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField({ telegramLink: e.target.value })}
            className="h-11 text-base"
            placeholder="t.me/yourshop"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Customers will contact you via this link
          </p>
        </div>

        {/* Social Links */}
        <div className="mb-5">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Optional Social Links</h3>

          {/* Instagram */}
          <div className="mb-3">
            <Label htmlFor="instagram" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-500" />
              Instagram
            </Label>
            <Input
              id="instagram"
              value={profile.instagram || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField({ instagram: e.target.value })}
              className="h-11 text-base pl-3"
              placeholder="username"
            />
          </div>

          {/* TikTok */}
          <div className="mb-3">
            <Label htmlFor="tiktok" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Music className="w-4 h-4 text-gray-900" />
              TikTok
            </Label>
            <Input
              id="tiktok"
              value={profile.tiktok || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField({ tiktok: e.target.value })}
              className="h-11 text-base pl-3"
              placeholder="@username"
            />
          </div>
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-[480px] mx-auto">
        <Button
          onClick={handleSave}
          disabled={mutation.isPending}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg"
        >
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Layout>
  );
}