import React from 'react';
import { useState, useEffect, useMemo, createContext, useContext, ReactNode } from 'react';

interface RouteContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
}

const RouteContext = createContext<RouteContextType>({
  currentPath: '/',
  navigate: () => {},
  params: {},
});

export function useNavigate() {
  const { navigate } = useContext(RouteContext);
  return navigate;
}

export function useParams() {
  const { params } = useContext(RouteContext);
  return params;
}

export function useLocation() {
  const { currentPath } = useContext(RouteContext);
  return { pathname: currentPath };
}

interface Route {
  path: string;
  element: ReactNode;
}

interface RouterProps {
  routes: Route[];
}

function matchPath(pattern: string, path: string): { match: boolean; params: Record<string, string> } {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (pattern === '*') {
    return { match: true, params: {} };
  }

  if (patternParts.length !== pathParts.length) {
    return { match: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = pathPart;
    } else if (patternPart !== pathPart) {
      return { match: false, params: {} };
    }
  }

  return { match: true, params };
}

export function Router({ routes }: RouterProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Use useMemo to compute matched route and params
  const { matchedRoute, params } = useMemo(() => {
    // Find matching route
    for (const route of routes) {
      const result = matchPath(route.path, currentPath);
      if (result.match) {
        return { matchedRoute: route, params: result.params };
      }
    }

    // If no match, try wildcard route
    const wildcardRoute = routes.find(r => r.path === '*');
    if (wildcardRoute) {
      return { matchedRoute: wildcardRoute, params: {} };
    }

    return { matchedRoute: null, params: {} };
  }, [currentPath, routes]);

  return (
    <RouteContext.Provider value={{ currentPath, navigate, params }}>
      {matchedRoute?.element || <div>404 - Not Found</div>}
    </RouteContext.Provider>
  );
}

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  children: ReactNode;
}

export function Link({ to, children, className, style, ...anchorProps }: LinkProps) {
  const { navigate } = useContext(RouteContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} style={style} {...anchorProps}>
      {children}
    </a>
  );
}