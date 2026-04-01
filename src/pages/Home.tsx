import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, BookOpen, BarChart3, Shield, Sparkles, ChevronRight, Brain, Target, Zap } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent"></div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-2/3 left-1/2 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full"></div>
                <TrendingUp className="w-7 h-7 text-blue-400 relative z-10 transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Kavon</span>
            </div>
            <button
              onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/login')}
              className="group/button px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white border border-slate-700/50 rounded-lg hover:border-slate-600 transition-all duration-300 hover:bg-slate-800/50 backdrop-blur-sm cursor-pointer"
            >
              {isAuthenticated ? 'Dashboard' : 'Sign In'}
              <ChevronRight className="inline-block w-4 h-4 ml-1 transition-transform duration-300 group-hover/button:translate-x-1" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-40 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">AI-Powered Trading Education</span>
            </div>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight">
            <span className="block bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
              Master Trading with
            </span>
            <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-orange-400 bg-clip-text text-transparent">
              AI-Powered Education
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform from novice to expert trader with intelligent lessons, real-time simulations, and personalized AI guidance that adapts to your learning style.
          </p>

          <div className="flex justify-center mb-20">
            <button
              onClick={() => navigate('/waitlist')}
              className="group/cta relative px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-500 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Learning Free
                <Sparkles className="w-5 h-5 transition-transform duration-500 group-hover/cta:rotate-12" />
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500 blur-xl"></div>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-32">
            {[
              { value: '10K+', label: 'Active Learners' },
              { value: '95%', label: 'Success Rate' },
              { value: '24/7', label: 'AI Support' }
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent mb-2 transition-transform duration-500 group-hover:scale-110">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: 'AI-Driven Insights',
              desc: 'Advanced algorithms analyze your progress and adapt lessons to maximize learning efficiency.',
              gradient: 'from-blue-500 to-blue-600',
              glow: 'blue-500'
            },
            {
              icon: BarChart3,
              title: 'Real-Time Markets',
              desc: 'Practice with live market data in a risk-free environment that mirrors real trading conditions.',
              gradient: 'from-orange-500 to-orange-600',
              glow: 'orange-500'
            },
            {
              icon: Target,
              title: 'Proven Strategies',
              desc: 'Learn battle-tested techniques used by professional traders to consistently beat the market.',
              gradient: 'from-slate-500 to-slate-600',
              glow: 'slate-500'
            }
          ].map((feature, i) => (
            <div key={i} className="group relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}></div>
              <div className="relative h-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/50 transition-all duration-500 hover:border-slate-700 cursor-pointer hover:bg-slate-900/70">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-${feature.glow}/25 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 transition-colors duration-300">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-32 text-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-orange-500 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 border border-slate-800/50">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg shadow-orange-500/25">
                <Zap className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
                Ready to Transform Your Trading?
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                Join thousands of traders who've elevated their skills with our AI-powered platform.
              </p>
              <button
                onClick={() => navigate('/waitlist')}
                className="group/cta2 relative px-10 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-500 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Now
                  <ChevronRight className="w-5 h-5 transition-transform duration-500 group-hover/cta2:translate-x-1" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
