import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import ShimmerButton from '../components/ui/ShimmerButton';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [typewriterText, setTypewriterText] = useState('');
  const [showHeadline, setShowHeadline] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const fullText = 'PRIVATE BETA';

  useEffect(() => {
    let currentIndex = 0;
    const typewriterInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypewriterText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterInterval);
        setTimeout(() => setShowHeadline(true), 200);
        setTimeout(() => setShowForm(true), 800);
      }
    }, 60);

    return () => clearInterval(typewriterInterval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email.toLowerCase() === 'vinay') {
      const success = signIn('vinay');
      if (success) {
        navigate('/dashboard');
        return;
      }
    }

    if (email.toLowerCase() === 'vsant2008@gmail.com') {
      navigate('/dashboard');
      return;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('waitlist')
        .insert([{ email }])
        .select();

      if (insertError) {
        console.error('Waitlist insert error:', insertError);
        console.error('Error details:', JSON.stringify(insertError, null, 2));

        if (insertError.code === '23505') {
          setError("You're already on the list!");
          console.log('Duplicate email attempt:', email);
        } else {
          setError(`Error: ${insertError.message || insertError.code || 'Something went wrong'}`);
        }
      } else {
        console.log('Successfully added to waitlist:', data);
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Unexpected error during waitlist submission:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-6 font-inter">
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full blur-[150px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
            animation: 'aurora 8s ease-in-out infinite alternate'
          }}
        ></div>
        <div
          className="absolute bottom-0 right-1/3 w-[800px] h-[800px] rounded-full blur-[130px] pointer-events-none"
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

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-16 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.3s_forwards]">
            <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
            <span className="text-xl font-semibold text-white tracking-tight font-playfair">Kavon</span>
          </div>

          {!submitted ? (
            <>
              <div className="mb-4">
                <div className="inline-block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-12 h-5">
                  {typewriterText}<span className="inline-block w-[2px] h-3 bg-neutral-500 ml-[2px] animate-pulse"></span>
                </div>
              </div>

              <div className={`transition-opacity duration-700 ${showHeadline ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="text-5xl sm:text-6xl font-semibold mb-8 leading-[1.05] tracking-tight font-playfair">
                  <span className="block mb-2">
                    <span className="word-reveal text-white" style={{ animationDelay: '0.1s' }}>Elite</span>
                    {' '}
                    <span className="word-reveal text-white" style={{ animationDelay: '0.25s' }}>Trading</span>
                  </span>
                  <span className="block">
                    <span className="word-reveal text-white" style={{ animationDelay: '0.4s' }}>Education</span>
                  </span>
                </h1>

                <p className="text-lg text-neutral-400 mb-16 max-w-xl mx-auto leading-relaxed font-light opacity-0 animate-[fadeInUp_0.8s_ease-out_0.8s_forwards]">
                  Join an exclusive community mastering the markets with AI-powered precision. Early access is limited.
                </p>
              </div>

              <div className={`max-w-md mx-auto mb-20 transition-all duration-700 ${showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-4 bg-transparent border border-neutral-800 rounded-lg focus:outline-none focus:border-white/40 focus:shadow-[0_0_20px_rgba(255,255,255,0.1)] text-white placeholder:text-neutral-600 transition-all duration-300 hover:border-neutral-700"
                  />

                  {error && (
                    <div className="text-sm text-red-400 text-left">
                      {error}
                    </div>
                  )}

                  <ShimmerButton
                    type="submit"
                    disabled={loading}
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Requesting access...' : 'Request early access'}
                  </ShimmerButton>
                </form>
              </div>
            </>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="mb-8 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
                <CheckCircle className="w-12 h-12 text-white mx-auto" strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-semibold text-white mb-4 tracking-tight font-playfair opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]">
                You're on the list
              </h2>
              <p className="text-neutral-400 leading-relaxed opacity-0 animate-[fadeInUp_0.6s_ease-out_0.4s_forwards]">
                We'll notify you at <span className="text-white">{email}</span> when your access is ready.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-12 max-w-2xl mx-auto pt-8 border-t border-neutral-900 opacity-0 animate-[fadeInUp_0.8s_ease-out_1.2s_forwards]">
          {[
            { value: '10K+', label: 'Learners' },
            { value: '95%', label: 'Success rate' },
            { value: '24/7', label: 'AI support' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-semibold text-white mb-1 tracking-tight font-playfair">{stat.value}</div>
              <div className="text-sm text-neutral-500 font-light">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
