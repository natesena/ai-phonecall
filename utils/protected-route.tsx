'use client';

import React, { useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
}

const routes = {
  protected: ['/dashboard', '/'],
  unprotected: ['/sign-in', '/sign-up'],
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Handles route redirection based on user authentication status
   * and the type of route being accessed.
   */
  const handleRouteProtection = useCallback(() => {
    if (status === 'loading') return;

    const isProtectedRoute = routes.protected.some((path) =>
      pathname.startsWith(path)
    );
    const isUnprotectedRoute = routes.unprotected.some((path) =>
      pathname.startsWith(path)
    );

    if (
      status === 'unauthenticated' &&
      isProtectedRoute &&
      !['/sign-up', '/verify-phoneno'].some((path) =>
        pathname.startsWith(path)
      )
    ) {
      router.push('/sign-in'); // Redirect to login if unauthenticated and accessing a protected route
    }

    if (status === 'authenticated' && isUnprotectedRoute) {
      router.push('/'); // Redirect to the dashboard if authenticated and accessing an unprotected route
    }
  }, [status, pathname, router]);

  useEffect(() => {
    handleRouteProtection();
  }, [handleRouteProtection]);

  return <>{children}</>
};

export default ProtectedRoute;
