import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Study() {
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      window.location.href = '/trading.html';
    }
  }, [loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-600">Loading...</div>
    </div>
  );
}
