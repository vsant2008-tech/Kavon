import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">Welcome to your trading platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Trading Lessons</h3>
            <p className="text-slate-600 mb-4">
              Access your interactive trading lessons and improve your skills
            </p>
            <button
              onClick={() => navigate('/study')}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Start Learning
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Portfolio</h3>
            <p className="text-slate-600 mb-4">
              Track your performance and analyze your trading history
            </p>
            <button className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
              View Portfolio
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Market Insights</h3>
            <p className="text-slate-600 mb-4">
              Stay updated with the latest market trends and analysis
            </p>
            <button className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
              View Insights
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <p className="text-slate-600">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}
