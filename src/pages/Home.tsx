import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { X, TrendingUp, BookOpen, BarChart3, Shield } from 'lucide-react';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setShowLoginModal(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleProtectedAction = (action: string) => {
    if (user) {
      if (action === 'study') {
        navigate('/study');
      } else if (action === 'simulation') {
        navigate('/dashboard');
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">Kavon</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Master Trading with
              <span className="text-blue-600"> AI-Powered</span> Education
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Learn to trade like a pro with interactive lessons, real-time simulations, and personalized AI guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => handleProtectedAction('study')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg h-auto"
              >
                Start Learning Free
              </Button>
              <Button
                onClick={() => handleProtectedAction('simulation')}
                size="lg"
                variant="outline"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 text-lg h-auto"
              >
                Try Live Simulation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Interactive Study</h3>
              <p className="text-slate-600 leading-relaxed">
                Access comprehensive lessons with real market scenarios and hands-on practice exercises.
              </p>
              <Button
                onClick={() => handleProtectedAction('study')}
                variant="link"
                className="mt-4 text-blue-600 hover:text-blue-700 p-0"
              >
                Explore Lessons →
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Live Simulation</h3>
              <p className="text-slate-600 leading-relaxed">
                Practice trading with real-time market data in a risk-free simulated environment.
              </p>
              <Button
                onClick={() => handleProtectedAction('simulation')}
                variant="link"
                className="mt-4 text-blue-600 hover:text-blue-700 p-0"
              >
                Start Simulation →
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Risk-Free Learning</h3>
              <p className="text-slate-600 leading-relaxed">
                Build confidence and develop strategies without risking real money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-slate-600">Sign in to access your trading platform</p>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                className="w-full h-12 text-base font-medium bg-white text-slate-700 border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    style={{ fill: '#4285F4' }}
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    style={{ fill: '#34A853' }}
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    style={{ fill: '#FBBC05' }}
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    style={{ fill: '#EA4335' }}
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="mt-6 text-center text-sm text-slate-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
