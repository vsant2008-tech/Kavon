import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Study() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      sessionStorage.setItem('supabase_url', import.meta.env.VITE_SUPABASE_URL || '');
      sessionStorage.setItem('supabase_anon_key', import.meta.env.VITE_SUPABASE_ANON_KEY || '');
      window.location.href = '/trading.html';
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return null;
}
