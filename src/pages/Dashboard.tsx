import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, BookOpen, Target, Award, ArrowRight, BarChart2, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface LessonRecord {
  id: string;
  lesson_ticker: string;
  lesson_module: string;
  difficulty: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

const START_BALANCE = 1000;
const PNL_PER_WIN = 47.5;
const PNL_PER_LOSS = -28.3;

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

function fmtSigned(n: number) {
  const s = Math.abs(n).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  return (n >= 0 ? '+' : '-') + s;
}

function diffColor(d: string) {
  if (d === 'beginner') return 'bg-emerald-50 text-emerald-700';
  if (d === 'intermediate') return 'bg-amber-50 text-amber-700';
  return 'bg-red-50 text-red-700';
}

function diffLabel(d: string) {
  if (d === 'beginner') return 'Beginner';
  if (d === 'intermediate') return 'Intermediate';
  return 'Advanced';
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<LessonRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .then(({ data }) => {
        setLessons(data ?? []);
        setLoading(false);
      });
  }, [user]);

  const completed = lessons.filter(l => l.completed);
  const wins = completed.filter(l => l.lesson_module === 'win' || l.difficulty !== 'advanced').length;
  const losses = completed.length - wins;
  const winRate = completed.length > 0 ? Math.round((wins / completed.length) * 100) : 0;
  const pnl = wins * PNL_PER_WIN + losses * PNL_PER_LOSS;
  const balance = START_BALANCE + pnl;
  const pnlPositive = pnl >= 0;

  const streakDots = completed.slice(0, 14).reverse();
  const recentTrades = completed.slice(0, 8);

  const name = user?.user_metadata?.full_name?.split(' ')[0]
    || user?.user_metadata?.name?.split(' ')[0]
    || 'Trader';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f5fc]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Loading your portfolio…</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f5fc]">
      <Navbar />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-7">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Welcome back</p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">

            {/* Portfolio Hero */}
            <div className="rounded-2xl bg-[#0a1628] px-7 py-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #2196f3 0%, transparent 70%)', transform: 'translate(40%, -40%)' }} />
              <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-white/40 mb-1">Paper Portfolio Balance</p>
              <p className="font-mono text-4xl font-medium text-white tracking-tight leading-none mb-2">{fmt(balance)}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`font-mono text-base font-semibold ${pnlPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {fmtSigned(pnl)}
                </span>
                <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${pnlPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                  {pnlPositive ? '+' : ''}{((pnl / START_BALANCE) * 100).toFixed(2)}%
                </span>
                <span className="text-[11px] text-white/30">all time · started at {fmt(START_BALANCE)}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-white/10">
                {[
                  { val: completed.length, label: 'Lessons Done' },
                  { val: `${winRate}%`, label: 'Win Rate' },
                  { val: lessons.length, label: 'Total Attempts' },
                ].map(m => (
                  <div key={m.label}>
                    <p className="font-mono text-base font-semibold text-white">{m.val}</p>
                    <p className="text-[10px] text-white/35 mt-0.5 uppercase tracking-wider">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: <Target className="w-4 h-4" />,
                  label: 'Win Rate',
                  val: `${winRate}%`,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50',
                },
                {
                  icon: <TrendingUp className="w-4 h-4" />,
                  label: 'Total Wins',
                  val: wins,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                },
                {
                  icon: <TrendingDown className="w-4 h-4" />,
                  label: 'Total Losses',
                  val: losses,
                  color: 'text-red-500',
                  bg: 'bg-red-50',
                },
                {
                  icon: <BookOpen className="w-4 h-4" />,
                  label: 'Completed',
                  val: completed.length,
                  color: 'text-slate-700',
                  bg: 'bg-slate-100',
                },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className={`w-7 h-7 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-2`}>
                    {s.icon}
                  </div>
                  <p className="font-mono text-xl font-semibold text-slate-900">{s.val}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Win / Loss Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Win / Loss Ratio</p>
              {completed.length === 0 ? (
                <p className="text-sm text-slate-400">No lessons completed yet.</p>
              ) : (
                <>
                  <div className="h-3 rounded-full bg-red-100 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${winRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-xs text-slate-500">
                    <span className="text-emerald-600 font-semibold">{wins} wins</span>
                    <span className="text-red-500 font-semibold">{losses} losses</span>
                  </div>
                </>
              )}
            </div>

            {/* Recent Streak */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Recent Activity</p>
              {streakDots.length === 0 ? (
                <p className="text-sm text-slate-400">Start a lesson to see your streak here.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {streakDots.map((l, i) => (
                    <div
                      key={l.id}
                      title={`${l.lesson_ticker} · ${l.completed_at ? new Date(l.completed_at).toLocaleDateString() : ''}`}
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold
                        ${l.lesson_module !== 'loss' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}
                    >
                      {l.lesson_ticker.slice(0, 2)}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5">

            {/* Recent Trades */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Recent Trades</p>
              {recentTrades.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BarChart2 className="w-8 h-8 text-slate-200 mb-2" />
                  <p className="text-sm text-slate-400">No trades yet. Complete a lesson to record your first trade.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {recentTrades.map(l => {
                    const isWin = l.lesson_module !== 'loss';
                    const tradePnl = isWin ? PNL_PER_WIN : PNL_PER_LOSS;
                    return (
                      <div key={l.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50">
                        <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded min-w-[44px] text-center">
                          {l.lesson_ticker}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-slate-700 truncate capitalize">{l.lesson_module} trade</p>
                          <p className="text-[10px] text-slate-400">
                            {l.completed_at ? new Date(l.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                            {' · '}
                            <span className={`font-semibold ${diffColor(l.difficulty).split(' ')[1]}`}>{diffLabel(l.difficulty)}</span>
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`font-mono text-[12px] font-bold ${isWin ? 'text-emerald-600' : 'text-red-500'}`}>
                            {fmtSigned(tradePnl)}
                          </p>
                          <div className={`w-1.5 h-1.5 rounded-full ml-auto mt-0.5 ${isWin ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Lessons CTA */}
            <div className="bg-[#0a1628] rounded-xl p-5 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-32 h-32 rounded-full opacity-15"
                style={{ background: 'radial-gradient(circle, #2196f3 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Paper Trading</p>
              </div>
              <p className="text-white font-bold text-base mb-1 leading-snug">Ready to practice?</p>
              <p className="text-white/50 text-xs mb-4 leading-relaxed">
                Trade real scenarios with AI feedback. No real money — just real learning.
              </p>
              <button
                onClick={() => navigate('/study')}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Go to Lessons
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Achievement */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-amber-500" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Achievement</p>
              </div>
              {completed.length === 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 text-lg flex-shrink-0">🔒</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">First Trade</p>
                    <p className="text-xs text-slate-400">Complete your first lesson to unlock.</p>
                  </div>
                </div>
              )}
              {completed.length >= 1 && completed.length < 5 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-lg flex-shrink-0">🎯</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">First Trade</p>
                    <p className="text-xs text-slate-400">You made your first paper trade.</p>
                  </div>
                </div>
              )}
              {completed.length >= 5 && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">🔥</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">5-Trade Streak</p>
                    <p className="text-xs text-slate-400">Completed {completed.length} lessons total.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
