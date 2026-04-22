'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!loggedIn) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Enquanto verifica o login, não renderiza o conteúdo protegido
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F0F0F]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
