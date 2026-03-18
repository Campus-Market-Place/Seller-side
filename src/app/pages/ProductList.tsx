import { useEffect, useState } from 'react';
import { Link } from '@/app/lib/router';
import { Layout } from '@/app/components/Layout';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';

import { getSellerProfile } from '@/app/api/seller-profile';
import {
  getShopProducts,
  updateProductStatus,
  deleteProduct
} from '@/app/api/products';

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

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products
  const loadProducts = async () => {
    try {
      setLoading(true);

      const sellerRes = await getSellerProfile();
      const shopId = sellerRes?.data?.profile?.shop?.id;

      if (!shopId) return;

      const productsRes = await getShopProducts(shopId);

      const backendProducts = productsRes?.data?.products || [];

      const mapped: Product[] = backendProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images?.[0]?.imagePath || "",
        rating: p.ratingAverage || 0,
        status: p.isActive === false || p.active === false ? "hidden" : "active",
      }));

      setProducts(mapped);

    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
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

      await updateProductStatus(id, newActive);

      setProducts(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, status: newActive ? "active" : "hidden" }
            : p
        )
      );
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

  if (loading) {
    return (
      <Layout title="Manage Products" showBack>
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
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
                          className="flex-1 h-8 rounded-md text-xs font-medium bg-blue-50 text-blue-900 hover:bg-blue-100 transition"
                        >
                          {product.status === "active" ? "Hide" : "Show"}
                        </button>
                      )}

                      {canEdit && (
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 hover:bg-blue-100 transition"
                        >
                          <Edit2 className="w-4 h-4 text-blue-900" />
                        </Link>
                      )}

                      {canEdit && (
                        <button
                          onClick={() => handleDelete(product.id)}
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