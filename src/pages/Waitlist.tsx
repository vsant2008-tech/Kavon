import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, CheckCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <TrendingUp className="w-8 h-8 text-blue-600" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-slate-900">Kavon</span>
          </div>

          {!submitted ? (
            <>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                Coming Soon
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Kavon is currently in private beta. Join the waitlist to get early access to our AI-powered trading education platform.
              </p>

              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2 text-left">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                You're on the list!
              </h2>
              <p className="text-slate-600">
                We'll notify you at <span className="font-medium text-slate-900">{email}</span> when Kavon is ready for you.
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">AI-Powered</div>
            <div className="text-sm text-slate-600">Personalized learning paths</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">Real-Time</div>
            <div className="text-sm text-slate-600">Live market simulations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">Risk-Free</div>
            <div className="text-sm text-slate-600">Practice without consequences</div>
          </div>
        </div>
      </div>
    </div>
  );
}
