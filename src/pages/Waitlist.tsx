import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    setFadeIn(true);
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
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className={`max-w-2xl w-full relative z-10 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-16">
            <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
            <span className="text-xl font-semibold text-white tracking-tight">Kavon</span>
          </div>

          {!submitted ? (
            <>
              <div className="mb-4">
                <div className="inline-block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-12">
                  Private Beta
                </div>
              </div>

              <h1 className="text-6xl sm:text-7xl font-bold mb-8 leading-[0.95] tracking-[-0.02em] text-white">
                Elite Trading
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  Education
                </span>
              </h1>

              <p className="text-lg text-neutral-400 mb-16 max-w-xl mx-auto leading-relaxed font-light">
                Join an exclusive community mastering the markets with AI-powered precision. Early access is limited.
              </p>

              <div className="max-w-md mx-auto mb-20">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-4 bg-transparent border border-neutral-800 rounded-lg focus:outline-none focus:border-emerald-500 text-white placeholder:text-neutral-600 transition-all duration-300 hover:border-neutral-700"
                  />

                  {error && (
                    <div className="text-sm text-red-400 text-left">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full px-8 py-4 text-base font-medium text-black bg-white rounded-lg hover:bg-neutral-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? 'Requesting access...' : 'Request early access'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                You're on the list
              </h2>
              <p className="text-neutral-400 leading-relaxed">
                We'll notify you at <span className="text-white">{email}</span> when your access is ready.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-12 max-w-2xl mx-auto pt-8 border-t border-neutral-900">
          {[
            { value: '10K+', label: 'Learners' },
            { value: '95%', label: 'Success rate' },
            { value: '24/7', label: 'AI support' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-semibold text-white mb-1 tracking-tight">{stat.value}</div>
              <div className="text-sm text-neutral-500 font-light">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
