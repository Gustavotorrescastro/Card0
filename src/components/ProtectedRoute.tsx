'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthorized, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthorized) {
      router.push('/login');
    }
  }, [isAuthorized, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#162056]"></div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return <>{children}</>;
}
