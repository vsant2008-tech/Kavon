import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    setFadeIn(true);
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-white" strokeWidth={2} />
              <span className="text-lg font-semibold text-white tracking-tight">Kavon</span>
            </div>
            <button
              onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/login')}
              className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white border border-neutral-800 rounded-lg hover:border-neutral-700 transition-all duration-300 cursor-pointer"
            >
              {isAuthenticated ? 'Dashboard' : 'Sign In'}
            </button>
          </div>
        </div>
      </header>

      <main className={`relative z-10 pt-32 pb-24 px-6 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-block text-xs font-medium text-neutral-500 uppercase tracking-wider">
              AI-Powered Trading Education
            </div>
          </div>

          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-bold mb-10 leading-[0.9] tracking-[-0.03em]">
            <span className="block text-white mb-3">
              Master Trading
            </span>
            <span className="block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              with AI
            </span>
          </h1>

          <p className="text-xl text-neutral-400 mb-14 max-w-2xl mx-auto leading-relaxed font-light">
            Transform from novice to expert with intelligent lessons, real-time simulations, and personalized guidance.
          </p>

          <div className="flex justify-center mb-32">
            <button
              onClick={() => navigate('/waitlist')}
              className="group inline-flex items-center gap-3 px-8 py-4 text-base font-medium text-black bg-white rounded-lg hover:bg-neutral-100 transition-all duration-300 cursor-pointer"
            >
              Start Learning Free
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-16 max-w-3xl mx-auto mb-32 pt-12 border-t border-neutral-900">
            {[
              { value: '10K+', label: 'Active learners' },
              { value: '95%', label: 'Success rate' },
              { value: '24/7', label: 'AI support' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-semibold text-white mb-2 tracking-tight">{stat.value}</div>
                <div className="text-sm text-neutral-500 font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-32">
          {[
            {
              title: 'AI-Driven Insights',
              desc: 'Algorithms analyze your progress and adapt lessons to maximize efficiency.'
            },
            {
              title: 'Real-Time Markets',
              desc: 'Practice with live data in a risk-free environment mirroring real conditions.'
            },
            {
              title: 'Proven Strategies',
              desc: 'Learn battle-tested techniques used by professional traders.'
            }
          ].map((feature, i) => (
            <div key={i} className="group">
              <div className="border border-neutral-900 rounded-lg p-8 transition-all duration-300 hover:border-neutral-800 cursor-pointer">
                <h3 className="text-lg font-semibold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <div className="border border-neutral-900 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-lg text-neutral-400 mb-10 font-light">
              Join thousands of traders who've elevated their skills with our platform.
            </p>
            <button
              onClick={() => navigate('/waitlist')}
              className="group inline-flex items-center gap-3 px-8 py-4 text-base font-medium text-black bg-white rounded-lg hover:bg-neutral-100 transition-all duration-300 cursor-pointer"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
