import { Link } from '@/app/lib/router';
import { Layout } from '@/app/components/Layout';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Edit } from 'lucide-react';
import { Plus, Package, Users, Bell, Settings, Eye, UserPlus, RefreshCw } from 'lucide-react';

import React, { useEffect, useMemo, useState } from 'react';
import { Product } from './ProductList';
import { Activity } from '../../types/data';
import {
  useFollowersQuery,
  useSellerProfileQuery,
  useShopDetailQuery,
  useShopProductsQuery,
} from '@/app/hooks/useApiQueries';


export function Dashboard() {
  const [shopLogoOverride, setShopLogoOverride] = useState<string | null>(null);

  const profileQuery = useSellerProfileQuery();
  const shopId = profileQuery.data?.data?.profile?.shop?.id as string | undefined;

  const shopQuery = useShopDetailQuery(shopId);
  const productsQuery = useShopProductsQuery(shopId);
  const followersQuery = useFollowersQuery(shopId);

  const shop = shopQuery.data?.data?.shop;
  const products = (productsQuery.data?.data?.products || []) as Product[];
  const followers = followersQuery.data || [];

  const recentActivities = useMemo<Activity[]>(() => {
    const followerNotifications: Activity[] = followers.map((f) => ({
      id: `follower-${f.id}`,
      type: 'follower',
      message: `@${f.user.username} started following your shop`,
      time: 'Recently',
      timestamp: new Date(f.createdAt).getTime(),
    }));

    const productNotifications: Activity[] = products.map((p: any) => ({
      id: `product-${p.id}`,
      type: 'product',
      message: `Product "${p.name}" is ${(p.isActive ?? true) ? 'active' : 'hidden'} in your shop`,
      time: 'Recently',
      timestamp: new Date(p.updatedAt || Date.now()).getTime(),
    }));

    return [...followerNotifications, ...productNotifications]
      .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
      .slice(0, 8);
  }, [followers, products]);

  useEffect(() => {
    const handler = (e: any) => {
      setShopLogoOverride(e.detail.logo);
    };

    window.addEventListener("shop-updated", handler);
    return () => window.removeEventListener("shop-updated", handler);
  }, []);

  const hasAnyData = Boolean(shop) || products.length > 0 || followers.length > 0;
  const isInitialLoading = !hasAnyData && (
    profileQuery.isLoading ||
    shopQuery.isLoading ||
    productsQuery.isLoading ||
    followersQuery.isLoading
  );

  const hasError = !hasAnyData && (
    profileQuery.isError ||
    shopQuery.isError ||
    productsQuery.isError ||
    followersQuery.isError
  );

  const refetchAll = () => {
    profileQuery.refetch();
    shopQuery.refetch();
    productsQuery.refetch();
    followersQuery.refetch();
  };

  const activeProducts = products.filter((p: any) => p.isActive).length;
  const shopImage = shopLogoOverride || shop?.profileImageUrl || '/default-shop.png';

  // Initial load without cache => skeletons.
  if (isInitialLoading) {
    return (
      <Layout>
        <div className="px-4 py-5">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <div className="mt-4 space-y-3">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (hasError) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="text-red-500">Failed to load dashboard.</p>
          <Button className="flex items-center gap-2" onClick={refetchAll}>
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col">
        {/* Shop Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900 px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={shopImage}
              alt="Shop"
              className="w-18 h-18 rounded-full object-cover border-2 border-white"
            />
            <div className="flex-1">
            {shop?.shopName ? (
              <h1 className="text-lg font-medium text-white">{shop.shopName}</h1>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white text-sm">Loading...</span>
              </div>
            )}
           <Link
              to="/profile"
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/30 transition"
            >
              <Edit className="w-4 h-4 text-white" />
          </Link>
          </div>
        </div>

          {/* Stats */}
          <div className="flex gap-2 items-stretch">
            <div className="flex-1 bg-blue-800 rounded-4xl p-3 flex flex-col items-center justify-center text-center">
              <div className="text-xl font-semibold text-white">{shop?.followersCount || followers.length}</div>
              <div className="text-[11px] text-white mt-0.5">Followers</div>
            </div>

            <div className="flex-1 bg-blue-800 rounded-4xl p-3 flex flex-col items-center justify-center text-center">
              <div className="text-xl font-semibold text-white">{products.length}</div>
              <div className="text-[11px] text-white mt-0.5">Products</div>
            </div>

            <div className="flex-1 bg-blue-800 rounded-4xl p-3 flex flex-col items-center justify-center text-center">
              <div className="text-xl font-semibold text-white">{activeProducts}</div>
              <div className="text-[11px] text-white mt-0.5">Active</div>
  </div>
</div>
        </div>

        
                  {/* Quick Actions */}
                  <div className='mt-6'></div>
          <div className="px-4 py-4 border-b border-gray-100 ">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Add Product */}
              <Link
                to="/products/new"
                className="flex flex-col items-center justify-center h-24 bg-blue-900 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-800"
              >
                <Plus className="w-6 h-6 text-white mb-1.5" />
                <span className="text-white text-sm font-medium">Add Product</span>
              </Link>

              {/* Products */}
              <Link
                to="/products"
                className="flex flex-col items-center justify-center h-24 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-100"
              >
                <Package className="w-6 h-6 text-blue-900 mb-1.5" />
                <span className="text-blue-900 text-sm font-medium">Products</span>
              </Link>

              {/* Followers */}
              <Link
                to="/followers"
                className="flex flex-col items-center justify-center h-24 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-blue-100"
              >
                <Users className="w-6 h-6 text-blue-900 mb-1.5" />
                <span className="text-blue-900 text-sm font-medium">Followers</span>
              </Link>

              {/* Updates */}
              <Link
                to="/notifications"
                className="flex flex-col items-center justify-center h-24 bg-white rounded-lg shadow-lg relative transition-transform transform hover:scale-105 hover:bg-blue-100"
              >
                <Bell className="w-6 h-6 text-blue-900 mb-1.5" />
                <span className="text-blue-900 text-sm font-medium">Updates</span>
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
              </Link>
            </div>
          </div>

        {/* Recent Activity */}
        <div className="px-4 py-4">
              <h2 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h2>
              {(shopQuery.isFetching || productsQuery.isFetching || followersQuery.isFetching) && (
                <p className="text-xs text-gray-500 mb-2">Updating...</p>
              )}

              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                {recentActivities.length === 0 && (
                  <div className="p-6 text-sm text-gray-500 text-center">
                    No recent activity yet.
                  </div>
                )}

                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-3 px-4 py-3 transition hover:bg-blue-50 ${
                      index !== recentActivities.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                        activity.type === "follower"
                          ? "bg-blue-100"
                          : "bg-blue-50"
                      }`}
                    >
                      {activity.type === "follower" ? (
                        <UserPlus className="w-4.5 h-4.5 text-blue-600" />
                      ) : (
                        <Eye className="w-4.5 h-4.5 text-blue-900" />
                      )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 leading-snug font-medium">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
      </div>
    </Layout>
  );
}