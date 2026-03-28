// pages/EditProductPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@/app/lib/router';
import { Layout } from '@/app/components/Layout';
import { useProductDetailQuery } from '@/app/hooks/useApiQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProduct } from '../api/products';

export function EditProductPage() {
  const { productId } = useParams() as { productId: string };
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch product detail
  const { data, isLoading, isError } = useProductDetailQuery(productId);

  // Local state for form
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<'active' | 'hidden'>('active');
  const [image, setImage] = useState<File | string>('');

  // Populate form when data is loaded
  useEffect(() => {
    if (data?.data?.product) {
      const product = data.data.product;
      setName(product.name);
      setPrice(product.price);
      setStatus(product.isActive ? 'active' : 'hidden');
      setImage(product.images?.[0]?.imagePath || '');
    }
  }, [data]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; name: string; price: number; status: 'hidden' | 'active'; image?: File | string }) =>
      updateProduct(payload.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-detail', productId] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] }); // refresh product list
      navigate('/products');
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to update product');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      id: productId!,
      name,
      price,
      status,
      image, // can be File or string (existing URL)
    });
  };

  if (isLoading) return <Layout title="Edit Product">Loading...</Layout>;
  if (isError) return <Layout title="Edit Product">Failed to load product.</Layout>;

  return (
    <Layout title="Edit Product" showBack>
      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-4 max-w-md mx-auto">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border rounded-md px-3 py-2"
            required
            min={0}
            step={0.01}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'hidden')}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
            className="w-full border rounded-md px-3 py-2"
          />
          {/* Preview */}
          {image && typeof image !== 'string' && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-md"
            />
          )}
          {image && typeof image === 'string' && (
            <img
              src={image}
              alt="Current"
              className="mt-2 w-32 h-32 object-cover rounded-md"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={updateMutation.status === 'pending'}
          className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition"
        >
          {updateMutation.status === 'pending' ? 'Updating...' : 'Update Product'}
        </button>

      </form>
    </Layout>
  );
}