import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-900">Kavon Trading</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata?.full_name || 'User avatar'}
                  className="w-9 h-9 rounded-full border-2 border-slate-200"
                />
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {user.user_metadata?.full_name || user.email}
                </p>
                {user.user_metadata?.full_name && (
                  <p className="text-xs text-slate-500">{user.email}</p>
                )}
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
