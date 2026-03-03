import { Layout } from '@/app/components/Layout';
import React, { useEffect, useState } from 'react';
import { Follower } from '../../types/data';
import { getFollowers } from '../api/followers';
import { apiFetch } from '../api/client';

export function Followers() {

  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);

  // get shopId from localStorage or seller profile
  const shopId = localStorage.getItem("shopId"); 

  useEffect(() => {

    async function loadFollowers() {
      try {

        // STEP 1: get seller profile
        const sellerProfile = await apiFetch("/api/seller-profile");

        const shopId = sellerProfile?.data?.profile?.shop?.id;

        console.log("ShopId:", shopId);

        // STEP 2: get followers
        const data = await getFollowers(shopId);

        console.log("Followers:", data);

        setFollowers(data);

      } catch (error) {
        console.error("Error loading followers:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFollowers();

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


        {/* Loading */}
        {loading && (
          <p className="px-4 py-4 text-sm text-gray-500">
            Loading followers...
          </p>
        )}


        {/* Followers List */}
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


        {/* Info Note */}
        <div className="mx-4 mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
          <p className="text-sm text-blue-900">
            💡 These users follow your shop and see your updates.
          </p>
        </div>

      </div>

    </Layout>
  );
}