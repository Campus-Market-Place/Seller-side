import { Layout } from '@/app/components/Layout';
import { Skeleton } from '@/app/components/ui/skeleton';
import React from 'react';
import { useFollowersQuery, useSellerProfileQuery } from '@/app/hooks/useApiQueries';

export function Followers() {
  const profileQuery = useSellerProfileQuery();
  const shopId = profileQuery.data?.data?.profile?.shop?.id as string | undefined;
  const followersQuery = useFollowersQuery(shopId);

  const followers = followersQuery.data || [];
  const hasAnyData = followers.length > 0;
  const isInitialLoading = !hasAnyData && (profileQuery.isLoading || followersQuery.isLoading);

  const errorMessage =
    (profileQuery.error as Error | undefined)?.message ||
    (followersQuery.error as Error | undefined)?.message ||
    '';
  const tokenMissing = /No auth token/i.test(errorMessage);
  const hasError = !tokenMissing && !hasAnyData && (profileQuery.isError || followersQuery.isError);

  const retry = () => {
    profileQuery.refetch();
    followersQuery.refetch();
  };

  return (
    <Layout title="Followers" showBack>
      <div className="pb-4">

        {/* Count */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            {followers.length} {followers.length === 1 ? 'follower' : 'followers'}
          </p>
        </div>

        {/* Token missing / login prompt */}
        {tokenMissing && (
          <div className="flex flex-col items-center justify-center py-10 space-y-2">
            <p className="text-red-500 text-center">
              You are not logged in. Please login via Telegram to see your followers.
            </p>
            <a
              href="YOUR_TELEGRAM_BOT_LOGIN_URL"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Login via Telegram
            </a>
          </div>
        )}

        {/* Loading without cache */}
        {isInitialLoading && !tokenMissing && (
          <div className="px-4 py-4 space-y-3">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        )}

        {/* Error */}
        {hasError && !tokenMissing && (
          <div className="flex flex-col items-center justify-center py-10 space-y-2">
            <p className="text-red-500">Failed to load followers.</p>
            <button
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg"
              onClick={retry}
            >
              Retry
            </button>
          </div>
        )}

        {/* Followers List */}
        {!isInitialLoading && !hasError && !tokenMissing && (
          <div className="divide-y divide-gray-100">
            {followers.map((follower) => (
              <div key={follower.id} className="flex items-center gap-3 px-4 py-3">
                {/* Avatar placeholder */}
                <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
                  👤
                </div>
                {/* User Info */}
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {follower.user.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    Followed {new Date(follower.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Note */}
        {!tokenMissing && (
          <div className="mx-4 mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-blue-900">
              💡 These users follow your shop and see your updates.
            </p>
            {followersQuery.isFetching && followers.length > 0 && (
              <p className="text-xs text-blue-700 mt-1">Refreshing followers...</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}