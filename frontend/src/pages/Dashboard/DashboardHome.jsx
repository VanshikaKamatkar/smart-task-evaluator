import { Link } from 'react-router-dom';
import { Plus, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Ready to evaluate your code? Submit a new task to get instant AI-powered feedback on performance, security, and best practices.
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard/new-task"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Start New Evaluation
          </Link>
        </div>
      </div>

      {/* Grid Layout for Stats/Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Quick Stats / Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-indigo-500" />
            Recent Activity
          </h3>
          {/* Placeholder for when we connect the API in Phase 6.8 */}
          <div className="mt-4 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">No recent evaluations found.</p>
            <Link to="/dashboard/new-task" className="text-indigo-600 text-sm hover:underline mt-1 block">
              Create your first one
            </Link>
          </div>
        </div>

        {/* Feature Teaser Card */}
        <div className="bg-indigo-900 p-6 rounded-xl shadow-sm text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold">AI Bug Fixer</h3>
            <p className="mt-2 text-indigo-100 text-sm">
              Stuck with a bug? Paste your broken code and let our AI suggest instant fixes and optimizations.
            </p>
            <Link 
              to="/dashboard/debug" 
              className="mt-4 inline-flex items-center text-sm font-medium text-white hover:text-indigo-200"
            >
              Try Debugger <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-800 rounded-full opacity-50"></div>
        </div>

      </div>
    </div>
  );
}