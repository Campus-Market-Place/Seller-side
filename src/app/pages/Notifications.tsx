import { Layout } from "@/app/components/Layout";
import { UserPlus, CheckCircle, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getFollowers } from "../api/followers";
import { apiFetch } from "../api/client";
import { Activity, Follower } from "../../types/data";
import { Product } from "./ProductList";

export function Notifications() {
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchShopData = async () => {
    setLoading(true);
    setError(false);
    try {
      // 1️⃣ Get seller profile
      const profileResponse = await apiFetch("/api/seller-profile");
      const shopId = profileResponse?.data?.profile?.shop?.id;
      if (!shopId) throw new Error("Shop ID not found");

      // 2️⃣ Get followers
      const followersData: Follower[] = await getFollowers(shopId);
      const followerNotifications: Activity[] = followersData.map(f => ({
        id: `follower-${f.id}`,
        type: "follower",
        message: `@${f.user.username} started following your shop`,
        time: "Recently",
        timestamp: new Date(f.createdAt).getTime(),
      }));

      // 3️⃣ Get products
      const productsRes: any = await apiFetch(`/api/products/shop/${shopId}`);
      const productsData: Product[] = productsRes.data.products;
      const productNotifications: Activity[] = productsData.map(p => ({
        id: `product-${p.id}`,
        type: "product",
        message: `Product "${p.name}" is ${p.status.toLowerCase()} in your shop`,
        time: "Recently",
        timestamp: new Date(p.updatedAt || Date.now()).getTime(),
      }));

      // 4️⃣ Combine and sort by timestamp
      const combinedActivities = [...followerNotifications, ...productNotifications]
        .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));

      setRecentActivities(combinedActivities);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();

    // ✅ Auto-refresh every 15 seconds
    const interval = setInterval(fetchShopData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Icons
  const getIcon = (type: string) => {
    if (type === "follower") return <UserPlus className="w-4.5 h-4.5 text-blue-600" />;
    if (type === "product") return <CheckCircle className="w-4.5 h-4.5 text-green-600" />;
    return <Eye className="w-4.5 h-4.5 text-gray-600" />;
  };

  // Backgrounds
  const getBg = (type: string) => {
    if (type === "follower") return "bg-blue-100";
    if (type === "product") return "bg-green-100";
    return "bg-gray-100";
  };

  return (
    <Layout title="Updates" showBack>
      <div className="pb-4">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm text-gray-600">Stay updated with your shop activity</p>
        </div>

        {/* Loading */}
        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading updates...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-10 space-y-2">
            <p className="text-red-500">Failed to load updates.</p>
            <button
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg"
              onClick={fetchShopData}
            >
              Retry
            </button>
          </div>
        )}

        {/* Notifications */}
        {!loading && !error && (
          <div className="divide-y divide-gray-100">
            {recentActivities.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No notifications yet.</div>
            ) : (
              recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start gap-3 px-4 py-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${getBg(activity.type)}`}>
                    {getIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-snug">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Info Note */}
        <div className="mx-4 mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
          <p className="text-sm text-gray-700 leading-relaxed">
            🔔 You'll receive notifications for new followers and product activity.
          </p>
        </div>
      </div>
    </Layout>
  );
}

