import { Router } from '@/app/lib/router';
import { routes } from '@/app/routes';
import React from 'react';

export default function App() {
  return <Router routes={routes} />;
}
