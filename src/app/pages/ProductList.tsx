import { useEffect, useState } from 'react';
import { Link } from '@/app/lib/router';
import { Layout } from '@/app/components/Layout';
import { Plus, Edit2, Trash2, Star, AlertCircle } from 'lucide-react';

import { getSellerProfile } from '@/app/api/seller-profile';
import {
  getShopProducts,
  updateProductStatus,
  deleteProduct
} from '@/app/api/products';
import React from 'react';
import { apiFetch } from '../api/client';

export type Product = {
  isActive: unknown;
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  status:  'active' | 'hidden' ;
  rejectionReason?: string;
};

export function ProductList() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from backend
  const loadProducts = async () => {
    try {
      setLoading(true);
  
      const sellerRes = await getSellerProfile();
      const shopId = sellerRes?.data?.profile?.shop?.id;
  
      if (!shopId) {
        console.error("Shop ID not found", sellerRes);
        return;
      }
  
      // ✅ Get products from backend
      const productsRes = await getShopProducts(shopId);
  
      // ✅ Add this log to see the real data from backend
      console.log("SHOP PRODUCTS RESPONSE:", productsRes.data.products);
  
      // ✅ Map backend products to your state
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

  // Delete product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
  
    try {
      await deleteProduct(id);
  
      // Remove from UI only if backend succeeded
      setProducts(prev => prev.filter(p => p.id !== id));
  
    } catch (err: any) {
      // Show real backend error to user
      alert(err.message || "Failed to delete product. Check console for details.");
      console.error("Delete failed", err);
    }
  };
  

  // Toggle show / hide
  
  const toggleStatus = async (id: string) => {
    try {
  
      // find product from state
      const product = products.find(p => p.id === id);
      
  
      if (!product) return;
      
  
      // determine new value
      const newActive = product.status === "hidden";
  
      // call backend
      await updateProductStatus(id, newActive);
  
      // update UI instantly (without reload)
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
        emoji: "🟢",
        text: "Active",
        color: "bg-green-50 text-green-700"
      };
    }
  
    return {
      emoji: "⚪",
      text: "Hidden",
      color: "bg-gray-50 text-gray-600"
    };
  
  };
  

  if (loading)
    return (
      <Layout title="Manage Products" showBack>
        Loading products...
      </Layout>
    );

  return (
    <Layout title="Manage Products" showBack>

      <div className="pb-20">

        {/* Product count */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            {products.length} {products.length === 1 ? "product" : "products"} total
          </p>
        </div>

        {/* Products list */}
        <div className="divide-y divide-gray-100">

          {products.map(product => {

            const status = getStatusBadge(product.status);

            const canEdit =
              product.status === "active" ||
              product.status === "hidden";

            return (

              <div key={product.id} className="bg-white px-4 py-3">

                <div className="flex gap-3">

                  {/* Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1">

                    <div className="flex justify-between mb-1">

                      <h3 className="font-medium text-sm">
                        {product.name}
                      </h3>

                      <span className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 ${status?.color}`}>
                        <span>{status?.emoji}</span>
                        <span>{status?.text}</span>
                      </span>

                    </div>

                    {/* Rating */}
                    {product.status === "active" && (
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="font-semibold mb-2">
                      ${product.price}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">

                      {/* Show / Hide */}
                      {canEdit && (
                        <button
                          onClick={() => toggleStatus(product.id)}
                          className="flex-1 h-8 bg-gray-100 rounded text-xs"
                        >
                          {product.status === "active" ? "Hide" : "Show"}
                        </button>
                      )}

                      {/* Edit */}
                      {canEdit && (
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-gray-700"/>
                        </Link>
                      )}

                      {/* Delete */}
                      {canEdit && (
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600"/>
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

        {/* Empty state */}
        {products.length === 0 && (

          <div className="text-center py-16">

            <p>No products yet</p>

            <Link
              to="/products/new"
              className="inline-block px-5 py-2 bg-blue-600 text-white rounded"
            >
              Add Product
            </Link>

          </div>

        )}

      </div>

      {/* Floating button */}
      <Link
        to="/products/new"
        className="fixed bottom-5 right-5 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center"
      >
        <Plus className="w-6 h-6 text-white"/>
      </Link>

    </Layout>
  );
}
