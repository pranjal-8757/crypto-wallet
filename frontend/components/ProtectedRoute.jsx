'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from './Loading';
import { clearAuthState, getValidAccessToken } from '@/lib/auth';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    getValidAccessToken()
      .then(() => { if (active) setAuthenticated(true); })
      .catch(() => { clearAuthState(); if (active) router.replace('/login'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [router]);

  if (loading) return <Loading label="Checking your session..." />;
  return authenticated ? <>{children}</> : null;
}
