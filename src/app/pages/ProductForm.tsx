import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from '@/app/lib/router';
import { Layout } from '@/app/components/Layout';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Skeleton } from '@/app/components/ui/skeleton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../api/createProduct';
import { useCategoriesQuery, useSellerProfileQuery } from '@/app/hooks/useApiQueries';

interface Category {
  id: string;
  name: string;
}

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const categoriesQuery = useCategoriesQuery();
  const profileQuery = useSellerProfileQuery();
  const categories = (categoriesQuery.data || []) as Category[];

  const createProductMutation = useMutation({
    mutationFn: ({ shopId, payload }: { shopId: string; payload: any }) => createProduct(shopId, payload),
    onSuccess: () => {
      const shopId = profileQuery.data?.data?.profile?.shop?.id;
      if (shopId) {
        queryClient.invalidateQueries({ queryKey: ['shop-products', shopId] });
      }
      queryClient.invalidateQueries({ queryKey: ['saved-products'] });
    },
  });

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newUrls: string[] = [];
    const newFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      newFiles.push(file);
      newUrls.push(URL.createObjectURL(file));
    }

    setImages(prev => [...prev, ...newUrls].slice(0, 5));
    setImageFiles(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const handleAddImage = () => fileInputRef.current?.click();
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const shopId = profileQuery.data?.data?.profile?.shop?.id;
      if (!shopId) {
        alert('Could not find your shop profile. Please try again.');
        return;
      }

      const response = await createProductMutation.mutateAsync({
        shopId,
        payload: {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId,
        images: imageFiles,
        },
      });

      console.log('Product created:', response);
      alert('Product created successfully!');
      navigate('/products');
    } catch (error: any) {
      console.error('Failed to create product', error);
      alert(error?.response?.data?.message || 'Failed to create product');
    }
  };

  const handleCancel = () => navigate('/products');
  const isInitialLoading = categories.length === 0 && categoriesQuery.isLoading;

  return (
    <Layout title={isEdit ? 'Edit Product' : 'Add Product'} showBack>
      <div className="px-4 py-5 pb-24">
        {isInitialLoading && (
          <div className="mb-5 space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        )}

        {/* Image Upload */}
        <div className="mb-5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            aria-label="Upload product images"
            className="hidden"
          />
          <Label className="text-sm font-medium text-gray-900 mb-2 block">
            Product Images
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square">
                <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                <button
                  onClick={() => handleRemoveImage(index)}
                  aria-label={`Remove image ${index + 1}`}
                  title={`Remove image ${index + 1}`}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-1.5 left-1.5 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Main
                  </div>
                )}
              </div>
            ))}
            {images.length < 5 && (
              <button
                onClick={handleAddImage}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 active:bg-gray-50"
              >
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-[10px] text-gray-500">Add</span>
              </button>
            )}
          </div>
          {images.length === 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-start gap-2 border-l-4 border-blue-600">
              <ImageIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 leading-snug">
                Add at least one photo. The first image will be the main display photo.
              </p>
            </div>
          )}
        </div>

        {/* Name, Description, Price */}
        <div className="mb-4">
          <Label htmlFor="productName" className="text-sm font-medium text-gray-900 mb-2 block">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="productName"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            className="h-11 text-base"
            placeholder="e.g., Wireless Headphones"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="description" className="text-sm font-medium text-gray-900 mb-2 block">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-20 text-base resize-none"
            placeholder="Describe your product..."
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="price" className="text-sm font-medium text-gray-900 mb-2 block">
            Price <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium">$</span>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
              className="h-11 text-base pl-8"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <Label htmlFor="category" className="text-sm font-medium text-gray-900 mb-2 block">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.categoryId} onValueChange={(value: string) => setFormData({ ...formData, categoryId: value })}>
            <SelectTrigger className="h-11 text-base" disabled={categoriesQuery.isLoading}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Info */}
        {!isEdit && (
          <div className="mt-6 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
            <p className="text-sm text-yellow-900 leading-snug">
              ℹ️ Your product will be reviewed before going live. You'll be notified once it's approved.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-[480px] mx-auto">
        <div className="flex gap-2">
          <Button onClick={handleCancel} variant="outline" className="flex-1 h-11 font-medium rounded-lg border-gray-300">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={createProductMutation.isPending}
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg"
          >
            {createProductMutation.isPending ? 'Submitting...' : isEdit ? 'Save' : 'Submit'}
          </Button>
        </div>
      </div>
    </Layout>
  );
}