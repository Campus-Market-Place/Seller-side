import { Dashboard } from '@/app/pages/Dashboard';
import { ShopProfile } from '@/app/pages/ShopProfile';
import { ProductList } from '@/app/pages/ProductList';
import { ProductForm } from '@/app/pages/ProductForm';
import { Followers } from '@/app/pages/Followers';
import { Notifications } from '@/app/pages/Notifications';
import { NotFound } from '@/app/pages/NotFound';
import React from 'react';
import { EditProductPage } from './pages/EditProductPage';

export const routes = [
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/profile',
    element: <ShopProfile />,
  },
  {
    path: '/products',
    element: <ProductList />,
  },
  {
    path: '/products/new',
    element: <ProductForm />,
  },
  {
    path: '/products/:productId/edit', 
    element: <EditProductPage/>,
  },
  {
    path: '/followers',
    element: <Followers />,
  },
  {
    path: '/notifications',
    element: <Notifications />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
