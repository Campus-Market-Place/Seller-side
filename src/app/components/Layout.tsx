import { ReactNode } from 'react';
import { useNavigate, useLocation } from '@/app/lib/router';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
}

export function Layout({ children, title, showBack = false }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[480px] mx-auto">
      {/* Header */}
      {(showBack || title) && (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="flex items-center h-14 px-4">
            {showBack && !isHome && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-10 h-10 -ml-2 mr-1 active:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}
            {title && (
              <h1 className="flex-1 text-base font-medium text-gray-900">{title}</h1>
            )}
          </div>
        </header>
      )}

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}