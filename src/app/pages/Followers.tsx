import { Layout } from '@/app/components/Layout';
import React, { useEffect, useState } from 'react';
import { Follower } from '../../types/data';
import { getFollowers } from '../api/followers';
import { apiFetch } from '../api/client';
import { getToken } from '../utils/getToken';

export function Followers() {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);

  // Function to load followers
  const loadFollowers = async () => {
    setLoading(true);
    setError(false);
    setTokenMissing(false);

    try {
      const token = getToken();
      if (!token) {
        setTokenMissing(true);
        return; // stop fetching
      }

      // 1️⃣ Get seller profile
      const sellerProfile = await apiFetch("/api/seller-profile", {}, token);
      const shopId = sellerProfile?.data?.profile?.shop?.id;
      if (!shopId) throw new Error("Shop ID not found");

      // 2️⃣ Get followers
      const data = await getFollowers(shopId);
      setFollowers(data);

    } catch (err) {
      console.error("Error loading followers:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowers();

    // Auto-refresh every 60 seconds
    const interval = setInterval(loadFollowers, 60000);
    return () => clearInterval(interval);
  }, []);

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

        {/* Loading */}
        {loading && !tokenMissing && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading followers...</p>
          </div>
        )}

        {/* Error */}
        {error && !tokenMissing && (
          <div className="flex flex-col items-center justify-center py-10 space-y-2">
            <p className="text-red-500">Failed to load followers.</p>
            <button
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg"
              onClick={loadFollowers}
            >
              Retry
            </button>
          </div>
        )}

        {/* Followers List */}
        {!loading && !error && !tokenMissing && (
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
          </div>
        )}
      </div>
    </Layout>
  );
}