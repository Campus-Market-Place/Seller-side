import { Layout } from "@/app/components/Layout";
import { Skeleton } from "@/app/components/ui/skeleton";
import { UserPlus, CheckCircle, Eye } from "lucide-react";
import React, { useMemo } from "react";
import { Activity } from "../../types/data";
import {
  useFollowersQuery,
  useSellerProfileQuery,
  useShopProductsQuery,
} from "@/app/hooks/useApiQueries";

export function Notifications() {
  const profileQuery = useSellerProfileQuery();
  const shopId = profileQuery.data?.data?.profile?.shop?.id as string | undefined;
  const followersQuery = useFollowersQuery(shopId);
  const productsQuery = useShopProductsQuery(shopId);

  const recentActivities = useMemo<Activity[]>(() => {
    const followers = followersQuery.data || [];
    const products = productsQuery.data?.data?.products || [];

    const followerNotifications: Activity[] = followers.map((f) => ({
      id: `follower-${f.id}`,
      type: "follower",
      message: `@${f.user.username} started following your shop`,
      time: "Recently",
      timestamp: new Date(f.createdAt).getTime(),
    }));

    const productNotifications: Activity[] = products.map((p: any) => ({
      id: `product-${p.id}`,
      type: "product",
      message: `Product "${p.name}" is ${(p.isActive ?? true) ? "active" : "hidden"} in your shop`,
      time: "Recently",
      timestamp: new Date(p.updatedAt || Date.now()).getTime(),
    }));

    return [...followerNotifications, ...productNotifications].sort(
      (a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0)
    );
  }, [followersQuery.data, productsQuery.data]);

  const hasAnyData = recentActivities.length > 0;
  const loading = !hasAnyData && (profileQuery.isLoading || followersQuery.isLoading || productsQuery.isLoading);
  const hasError = !hasAnyData && (profileQuery.isError || followersQuery.isError || productsQuery.isError);

  const retry = () => {
    profileQuery.refetch();
    followersQuery.refetch();
    productsQuery.refetch();
  };

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
        {loading && (
          <div className="p-4 space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        )}

        {hasError && (
          <div className="p-4">
            <p className="text-sm text-red-500 mb-2">Failed to load updates.</p>
            <button
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md"
              onClick={retry}
            >
              Retry
            </button>
          </div>
        )}

        {/* Notifications */}
        {!loading && !hasError && (
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
          {(followersQuery.isFetching || productsQuery.isFetching) && recentActivities.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">Refreshing updates...</p>
          )}
        </div>
      </div>
    </Layout>
  );
}