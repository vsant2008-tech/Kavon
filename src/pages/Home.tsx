import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, ArrowRight } from 'lucide-react';
import ShimmerButton from '../components/ui/ShimmerButton';
import ConstellationBackground from '../components/ui/ConstellationBackground';


export default function Home() {
  const { isAuthenticated, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [typewriterText, setTypewriterText] = useState('');
  const [showHeadline, setShowHeadline] = useState(false);

  const fullText = 'AI-POWERED TRADING EDUCATION';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    let currentIndex = 0;
    const typewriterInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypewriterText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
        setTimeout(() => setShowHeadline(true), 200);
      }
    }, 40);

    return () => clearInterval(typewriterInterval);
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-inter">
      <ConstellationBackground />

      <div className="absolute inset-0 opacity-30" style={{ zIndex: 2 }}>
        <div
          className="absolute top-1/4 right-1/3 w-[1200px] h-[1200px] rounded-full blur-[150px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
            animation: 'aurora 8s ease-in-out infinite alternate'
          }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-[900px] h-[900px] rounded-full blur-[130px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)',
            animation: 'aurora 10s ease-in-out infinite alternate-reverse'
          }}
        ></div>
      </div>

      <style>{`
        @keyframes aurora {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          100% { transform: translate(50px, -30px) scale(1.1); opacity: 0.5; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .word-reveal {
          display: inline-block;
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-white" strokeWidth={2} />
              <span className="text-lg font-semibold text-white tracking-tight font-playfair">Kavon</span>
            </div>
            <button
              onClick={() => isAuthenticated ? navigate('/dashboard') : signInWithGoogle()}
              className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white border border-neutral-800 rounded-lg hover:border-neutral-700 transition-all duration-300 cursor-pointer"
            >
              {isAuthenticated ? 'Dashboard' : 'Sign In'}
            </button>
          </div>
        </div>
      </header>

      <main className="relative pt-32 pb-24 px-6" style={{ zIndex: 10 }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-block text-xs font-medium text-neutral-500 uppercase tracking-wider h-5">
              {typewriterText}<span className="inline-block w-[2px] h-3 bg-neutral-500 ml-[2px] animate-pulse"></span>
            </div>
          </div>

          <div className={`transition-opacity duration-700 ${showHeadline ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold mb-10 leading-[1.1] tracking-tight font-playfair">
              <span className="block mb-3">
                <span className="word-reveal text-white" style={{ animationDelay: '0.1s' }}>Master</span>
                {' '}
                <span className="word-reveal text-white" style={{ animationDelay: '0.25s' }}>Trading</span>
              </span>
              <span className="block">
                <span className="word-reveal text-white" style={{ animationDelay: '0.4s' }}>with</span>
                {' '}
                <span className="word-reveal text-white" style={{ animationDelay: '0.55s' }}>AI</span>
              </span>
            </h1>

            <p className="text-lg text-neutral-400 mb-14 max-w-2xl mx-auto leading-relaxed font-light opacity-0 animate-[fadeInUp_0.8s_ease-out_1s_forwards]">
              Transform from novice to expert with intelligent lessons, real-time simulations, and personalized guidance.
            </p>

            <div className="flex justify-center mb-32 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.3s_forwards]">
              <ShimmerButton onClick={() => isAuthenticated ? navigate('/dashboard') : signInWithGoogle()}>
                Start Learning Free
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
              </ShimmerButton>
            </div>

            <div className="grid grid-cols-3 gap-16 max-w-3xl mx-auto mb-32 pt-12 border-t border-neutral-900 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.5s_forwards]">
              {[
                { value: '10K+', label: 'Active learners' },
                { value: '95%', label: 'Success rate' },
                { value: '24/7', label: 'AI support' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-semibold text-white mb-2 tracking-tight font-playfair">{stat.value}</div>
                  <div className="text-sm text-neutral-500 font-light">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-32 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.7s_forwards]">
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
                <h3 className="text-lg font-semibold text-white mb-3 tracking-tight font-playfair">{feature.title}</h3>
                <p className="text-neutral-500 leading-relaxed font-light">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center opacity-0 animate-[fadeInUp_0.8s_ease-out_1.9s_forwards]">
          <div className="border border-neutral-900 rounded-2xl p-12">
            <h2 className="text-4xl font-semibold text-white mb-6 tracking-tight font-playfair">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-lg text-neutral-400 mb-10 font-light">
              Join thousands of traders who've elevated their skills with our platform.
            </p>
            <ShimmerButton onClick={() => isAuthenticated ? navigate('/dashboard') : signInWithGoogle()}>
              Get Started Now
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
            </ShimmerButton>
          </div>
        </div>
      </main>
    </div>
  );
}
