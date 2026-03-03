import { Router } from '@/app/lib/router';
import { routes } from '@/app/routes';

export default function App() {
  return <Router routes={routes} />;
}
