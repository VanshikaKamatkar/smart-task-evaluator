import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, ArrowRight, FileText, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios'; // Import the API helper

export default function DashboardHome() {
  const { user } = useAuth();
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent tasks on component mount
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        // requesting limit=3 to show only the latest ones
        const res = await api.get('/tasks?limit=3');
        setRecentTasks(res.data.tasks);
      } catch (err) {
        console.error("Failed to load recent activity", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  // Helper helper to color-code scores
  const getScoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

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

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Activity Card (Dynamic Now) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-500" />
              Recent Activity
            </h3>
            <Link to="/dashboard/history" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </Link>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="h-40 flex items-center justify-center text-gray-400">
                 <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : recentTasks.length === 0 ? (
              // Empty State
              <div className="h-full flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm">No recent evaluations found.</p>
                <Link to="/dashboard/new-task" className="text-indigo-600 text-sm hover:underline mt-1 block">
                  Create your first one
                </Link>
              </div>
            ) : (
              // List of Tasks
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <Link
                    key={task._id}
                    to={`/dashboard/result/${task._id}`}
                    className="block group"
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${task.isPaid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-700">
                            {task.taskDescription || "Untitled Task"}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(task.createdAt).toLocaleDateString(undefined, {
                                month: 'short', day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right pl-2">
                        <span className={`text-xs font-bold ${getScoreColor(task.aiScore)}`}>
                          {task.aiScore ?? 'N/A'}
                        </span>
                        {task.aiScore && <span className="text-xs text-gray-400 ml-0.5">/100</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Bug Fixer Card */}
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
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-800 rounded-full opacity-50"></div>
        </div>

      </div>
    </div>
  );
}