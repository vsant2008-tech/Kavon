import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, CheckCircle, Sparkles, Lock, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent"></div>

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-10 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <TrendingUp className="w-10 h-10 text-blue-400 relative z-10 transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Kavon</span>
          </div>

          {!submitted ? (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm mb-8">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Private Beta</span>
                </div>
              </div>

              <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Elite Trading
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-orange-400 bg-clip-text text-transparent">
                  Education Awaits
                </span>
              </h1>

              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Join an exclusive community of traders mastering the markets with AI-powered precision.
                Early access is limited.
              </p>

              <div className="max-w-xl mx-auto mb-16">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-800/50 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-3 text-left">
                          Your Email
                        </label>
                        <div className="relative group/input">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors duration-300 group-focus-within/input:text-blue-400" />
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder:text-slate-600 transition-all duration-300 hover:border-slate-600"
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="group/button w-full relative px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] cursor-pointer"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {loading ? (
                            'Securing Your Spot...'
                          ) : (
                            <>
                              Request Early Access
                              <Sparkles className="w-4 h-4 transition-transform duration-500 group-hover/button:rotate-12" />
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-blue-600 opacity-0 group-hover/button:opacity-100 transition-opacity duration-500 blur-xl"></div>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl blur-lg opacity-25"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-12 border border-slate-800/50 shadow-2xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
                    <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
                    You're In
                  </h2>
                  <p className="text-slate-400 leading-relaxed">
                    Welcome to the exclusive waitlist. We'll notify you at{' '}
                    <span className="font-medium text-blue-400">{email}</span> when your access is ready.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Sparkles, label: 'AI-Powered', desc: 'Intelligent learning paths', color: 'from-blue-500 to-blue-600' },
            { icon: BarChart3, label: 'Real-Time Data', desc: 'Live market simulations', color: 'from-orange-500 to-orange-600' },
            { icon: Lock, label: 'Risk-Free', desc: 'Practice without limits', color: 'from-slate-500 to-slate-600' }
          ].map((item, i) => (
            <div key={i} className="group relative">
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`}></div>
              <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-800/50 text-center transition-all duration-500 hover:border-slate-700 cursor-pointer">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                  <item.icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div className="text-lg font-bold text-white mb-1">{item.label}</div>
                <div className="text-sm text-slate-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
