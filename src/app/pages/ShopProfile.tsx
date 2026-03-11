import React, { useState, useEffect } from 'react';
import { useNavigate } from '@/app/lib/router';
import { Layout } from '@/app/components/Layout';
import { Camera, Instagram, Music, RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { getSellerProfile, updateProfile } from '../api/seller-profile';

export function ShopProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getSellerProfile();
      const apiProfile = res.data.profile;

      setProfile({
        name: apiProfile.shop.shopName || "",
        description: apiProfile.shop.bio || "",
        telegramLink: apiProfile.telegram || "",
        instagram: apiProfile.instagram || "",
        tiktok: apiProfile.tiktok || "",
        campusLocation: apiProfile.campusLocation || "",
        mainPhone: apiProfile.mainPhone || "",
        secondaryPhone: apiProfile.secondaryPhone || "",
        categoryId: apiProfile.shop.categoryId || "",
        logo: apiProfile.shop.profileImage || "/default-shop.png",
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await updateProfile({
        shopName: profile.name,
        description: profile.description,
        campusLocation: profile.campusLocation,
        mainPhone: profile.mainPhone,
        secondaryPhone: profile.secondaryPhone,
        instagram: profile.instagram,
        telegram: profile.telegramLink,
        tiktok: profile.tiktok,
        profileImage: profile.profileImagePublicId ? [profile.profileImagePublicId] : undefined,
        agreedToRules: true,
      });

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

  if (loading) {
    return (
      <Layout title="Shop Profile" showBack>
        <div className="flex flex-col items-center justify-center py-20">
          {/* Circular Spinner */}
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
         
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Shop Profile" showBack>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="text-red-500">Failed to load profile.</p>
          <Button
            className="flex items-center gap-2"
            onClick={loadProfile}
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

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
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const previewUrl = URL.createObjectURL(file);
                  setProfile(prev => ({ ...prev, logo: previewUrl }));

                  await updateProfile({
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
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            className="min-h-20 text-base resize-none"
            placeholder="Tell customers about your shop"
          />
        </div>

        {/* Campus location */}
        <div className="mb-4">
          <Label>Campus Location</Label>
          <Input
            value={profile.campusLocation}
            onChange={(e) => setProfile({ ...profile, campusLocation: e.target.value })}
          />
        </div>

        {/* Main Phone */}
        <div className="mb-4">
          <Label>Main Phone</Label>
          <Input
            value={profile.mainPhone}
            onChange={(e) => setProfile({ ...profile, mainPhone: e.target.value })}
          />
        </div>

        {/* Secondary Phone */}
        <div className="mb-4">
          <Label>Secondary Phone</Label>
          <Input
            value={profile.secondaryPhone}
            onChange={(e) => setProfile({ ...profile, secondaryPhone: e.target.value })}
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
            onChange={(e) => setProfile({ ...profile, telegramLink: e.target.value })}
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
              onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
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
              onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })}
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
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg"
        >
          Save Changes
        </Button>
      </div>
    </Layout>
  );
}