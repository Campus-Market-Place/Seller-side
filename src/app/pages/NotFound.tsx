import { Link } from '@/app/lib/router';
import { Layout } from '@/app/components/Layout';
import { Home } from 'lucide-react';
import React from 'react';

export function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 -mt-14">
        <div className="text-center">
          <div className="text-5xl font-semibold text-gray-300 mb-3">404</div>
          <h1 className="text-xl font-medium text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-sm text-gray-600 mb-6">
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 active:bg-blue-700 text-white text-sm font-medium rounded-lg"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
}