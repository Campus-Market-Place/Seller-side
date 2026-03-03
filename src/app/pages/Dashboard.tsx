import { Link } from '@/app/lib/router';
import { Layout } from '@/app/components/Layout';
import { Plus, Package, Users, Bell, Settings, Eye, UserPlus } from 'lucide-react';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { Product } from './ProductList';
import { Activity, Follower } from '../../types/data';
import { getFollowers } from '../api/followers';
//import { getMyProfile } from '../api/seller-profile';

export function Dashboard() {
  //const activeProducts = mockProducts.filter(p => p.status === 'active').length;
  //const pendingProducts = mockProducts.filter(p => p.status === 'pending').length;
  //const [profile, setProfile] = useState<any>(null);
  //const [shopName, setShopName] = useState<string>("");
  const [shop, setShop] = React.useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchShopData() {
      try {
        // 1️⃣ Get seller profile
        const profileResponse = await apiFetch("/api/seller-profile");
        const shopId = profileResponse.data.profile.shop.id;

        // 2️⃣ Get full shop details
        const shopResponse = await apiFetch(`/api/shop/${shopId}`);
        setShop(shopResponse.data.shop);

        const followersData: Follower[] = await getFollowers(shopId);

        const followerNotifications: Activity[] = followersData.map(f => ({
          id: `follower-${f.id}`,
          type: "follower",
          message: `@${f.user.username} started following your shop`,
          time: "Recently",
          timestamp: Date.now() - Math.floor(Math.random() * 1000000), // example: use actual follow time
        }));
        
  
        // Products
        const productsRes: any = await apiFetch(`/api/products/shop/${shopId}`);
        const productsData = productsRes.data.products; // ✅ important

        setProducts(productsData);
  
        const productNotifications: Activity[] = productsData.map(p => ({
          id: `product-${p.id}`,
          type: "product",
          message: `Product "${p.name}" is ${p.status} in your shop`,
          time: "Recently",
          timestamp: new Date(p.updatedAt || Date.now()).getTime(), // use actual updatedAt if available
        }));
  
        // 2️⃣ Combine and sort by timestamp (newest first)
          const combinedActivities = [...followerNotifications, ...productNotifications]
            .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
          .slice(0, 8); // limit to 8 if needed

          setRecentActivities(combinedActivities);
      
      } catch (error) {
        console.error(error);
      }
    }
    fetchShopData();

     // ✅ Listen for updates from ShopProfile
  const handler = (e: any) => {
    setShop(prev => ({
      ...prev,
      profileImageUrl: e.detail.logo,
    }));
  };

  window.addEventListener("shop-updated", handler);

  return () => window.removeEventListener("shop-updated", handler);
   
  }, []);

  if (!shop) return <Layout>Loading...</Layout>;

  //const activeProducts = shop.products.filter((p: any) => p.status === 'active').length;
  //nst pendingProducts = shop.products.filter((p: any) => p.status === 'pending').length;
  //nst activeProducts = products.filter(p => p.status === "active").length;
  const activeProducts = products.filter(p => p.isActive).length;
  return (
    <Layout>
      <div className="flex flex-col">
        {/* Shop Header */}
        <div className="bg-blue-600 px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={shop.profileImageUrl || "/default-shop.png"}
              alt={"hh" }
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-400"
            />
            <div className="flex-1">
              <h1 className="text-lg font-medium text-white">{shop.shopName || "Loading..."}</h1>
              <Link to="/profile" className="text-sm text-blue-100 flex items-center gap-1 mt-0.5">
                <Settings className="w-3 h-3" />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-2">
            <div className="flex-1 bg-white/95 rounded-lg p-3">
              <div className="text-xl font-semibold text-gray-900">{shop.followersCount}</div>
              <div className="text-[11px] text-gray-600 mt-0.5">Followers</div>
            </div>
            <div className="flex-1 bg-white/95 rounded-lg p-3">
              <div className="text-xl font-semibold text-gray-900">{products.length}</div>
              <div className="text-[11px] text-gray-600 mt-0.5">Products</div>
            </div>
            <div className="flex-1 bg-white/95 rounded-lg p-3">
              <div className="text-xl font-semibold text-gray-900">{activeProducts}</div>
              <div className="text-[11px] text-gray-600 mt-0.5">Active</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-4 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/products/new"
              className="flex flex-col items-center justify-center h-24 bg-blue-600 active:bg-blue-700 rounded-lg"
            >
              <Plus className="w-6 h-6 text-white mb-1.5" />
              <span className="text-white text-sm font-medium">Add Product</span>
            </Link>

            <Link
              to="/products"
              className="flex flex-col items-center justify-center h-24 bg-gray-100 active:bg-gray-200 rounded-lg"
            >
              <Package className="w-6 h-6 text-gray-700 mb-1.5" />
              <span className="text-gray-900 text-sm font-medium">Products</span>
            </Link>

            <Link
              to="/followers"
              className="flex flex-col items-center justify-center h-24 bg-gray-100 active:bg-gray-200 rounded-lg"
            >
              <Users className="w-6 h-6 text-gray-700 mb-1.5" />
              <span className="text-gray-900 text-sm font-medium">Followers</span>
            </Link>

            <Link
              to="/notifications"
              className="flex flex-col items-center justify-center h-24 bg-gray-100 active:bg-gray-200 rounded-lg relative"
            >
              <Bell className="w-6 h-6 text-gray-700 mb-1.5" />
              <span className="text-gray-900 text-sm font-medium">Updates</span>
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="px-4 py-4">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h2>
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
          {recentActivities.length === 0 && (
  <div className="p-4 text-sm text-gray-500">No recent activity yet.</div>
)}

{recentActivities.map(activity => (
  <div key={activity.id} className="flex items-start gap-3 py-3">
    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
      activity.type === 'follower' ? 'bg-blue-100' : 'bg-green-100'
    }`}>
      {activity.type === 'follower' ? (
        <UserPlus className="w-4.5 h-4.5 text-blue-600" />
      ) : (
        <Eye className="w-4.5 h-4.5 text-green-600" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-900 leading-snug">{activity.message}</p>
      <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
    </div>
  </div>
))}
          </div>
        </div>
      </div>
    </Layout>
  );
}