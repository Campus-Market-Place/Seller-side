import { useMemo } from 'react';
import { Link } from '@/app/lib/router';
//import { Link } from 'react-router-dom';
import { Layout } from '@/app/components/Layout';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  updateProductStatus,
  deleteProduct
} from '@/app/api/products';
import { useSellerProfileQuery, useShopProductsQuery } from '@/app/hooks/useApiQueries';

import React from 'react';

export type Product = {
  isActive: unknown;
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  status: 'active' | 'hidden';
  rejectionReason?: string;
};

export function ProductList() {
  const queryClient = useQueryClient();
  const profileQuery = useSellerProfileQuery();
  const shopId = profileQuery.data?.data?.profile?.shop?.id as string | undefined;
  const productsQuery = useShopProductsQuery(shopId);

  const backendProducts = productsQuery.data?.data?.products || [];
  const products = useMemo<Product[]>(() => {
    return backendProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.images?.[0]?.imagePath || '',
      rating: p.ratingAverage || 0,
      status: p.isActive === false || p.active === false ? 'hidden' : 'active',
      isActive: p.isActive,
    }));
  }, [backendProducts]);

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSettled: () => {
      if (!shopId) return;
      queryClient.invalidateQueries({ queryKey: ['shop-products', shopId] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ productId, isActive }: { productId: string; isActive: boolean }) =>
      updateProductStatus(productId, isActive),
    onSettled: () => {
      if (!shopId) return;
      queryClient.invalidateQueries({ queryKey: ['shop-products', shopId] });
    },
  });

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || "Failed to delete product.");
      console.error(err);
    }
  };

  // Toggle status
  const toggleStatus = async (id: string) => {
    try {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const newActive = product.status === "hidden";
      await toggleMutation.mutateAsync({ productId: id, isActive: newActive });
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const getStatusBadge = (status: Product['status']) => {
    if (status === "active") {
      return {
        emoji: "🔵", //🟢
        text: "Active",
        color: "bg-blue-50 text-blue-700"
      };
    }

    return {
      emoji: "⚪",
      text: "Hidden",
      color: "bg-gray-100 text-gray-600"
    };
  };

  const isInitialLoading = products.length === 0 && (profileQuery.isLoading || productsQuery.isLoading);
  const hasError = products.length === 0 && (profileQuery.isError || productsQuery.isError);

  if (isInitialLoading) {
    return (
      <Layout title="Manage Products" showBack>
        <div className="px-4 py-5 space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (hasError) {
    return (
      <Layout title="Manage Products" showBack>
        <div className="px-4 py-8">
          <p className="text-sm text-red-500 mb-2">Failed to load products.</p>
          <button
            className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
            onClick={() => {
              profileQuery.refetch();
              productsQuery.refetch();
            }}
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Manage Products" showBack>

      <div className="pb-24">

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
          {productsQuery.isFetching && products.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">Refreshing products...</p>
          )}
        </div>

        {/* Product Cards */}
        <div className="space-y-3 px-4 py-3">

          {products.map(product => {

            const status = getStatusBadge(product.status);

            const canEdit =
              product.status === "active" ||
              product.status === "hidden";

            return (

              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3"
              >
                <div className="flex gap-6">

                  {/* Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-18 h-18 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1">

                    {/* Top */}
                    <div className="flex justify-between items-start mb-1">

                      <h3 className="font-semibold text-sm text-gray-900">
                        {product.name}
                      </h3>

                      <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${status.color}`}>
                        <span>{status.emoji}</span>
                        <span>{status.text}</span>
                      </span>

                    </div>

                    {/* Rating */}
                    {product.status === "active" && (
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">
                          {product.rating}
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="font-bold text-blue-900 mb-2">
                      ${product.price}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">

                      {canEdit && (
                        <button
                          onClick={() => toggleStatus(product.id)}
                          disabled={toggleMutation.isPending}
                          className="flex-1 h-8 rounded-md text-xs font-medium bg-blue-50 text-blue-900 hover:bg-blue-100 transition"
                        >
                          {product.status === "active" ? "Hide" : "Show"}
                        </button>
                      )}

                      {canEdit && (
                        <Link
                        
                          to={`/products/${product.id}/edit`}
                          //state={{ product }}
                          title="Edit product"
                          aria-label="Edit product"
                          className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 hover:bg-blue-100 transition"
                        >
                          <Edit2 className="w-4 h-4 text-blue-900" />
                        </Link>
                      )}

                      {canEdit && (
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteMutation.isPending}
                          title="Delete product"
                          aria-label="Delete product"
                          className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                        >
                          <Trash2 className="w-4 h-4 text-black-500" />
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              </div>

            );

          })}

        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No products yet</p>

            <Link
              to="/products/new"
              className="inline-block px-5 py-2 bg-blue-900 text-white rounded-lg shadow hover:bg-blue-800 transition"
            >
              Add Product
            </Link>
          </div>
        )}

      </div>

      {/* Floating Button */}
      <Link
        to="/products/new"
        className="fixed bottom-5 right-5 w-14 h-14 bg-blue-900 hover:bg-blue-800 rounded-full flex items-center justify-center shadow-lg transition"
      >
        <Plus className="w-6 h-6 text-white"/>
      </Link>

    </Layout>
  );
}