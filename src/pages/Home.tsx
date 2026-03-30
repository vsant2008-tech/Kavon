import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, BookOpen, BarChart3, Shield } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
              <span className="text-xl font-bold text-slate-900">Kavon</span>
            </div>
            <button
              onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {isAuthenticated ? 'Dashboard' : 'Sign In'}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Master Trading with <span className="text-blue-600">AI-Powered</span> Education
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Learn to trade like a pro with interactive lessons, real-time simulations, and personalized AI guidance.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/waitlist')}
              className="px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Learning Free
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Interactive Study</h3>
            <p className="text-slate-600 mb-4">
              Access comprehensive lessons with real market scenarios and hands-on practice exercises.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Live Simulation</h3>
            <p className="text-slate-600 mb-4">
              Practice trading with real-time market data in a risk-free simulated environment.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Risk-Free Learning</h3>
            <p className="text-slate-600 mb-4">
              Build confidence and develop strategies without risking real money.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
