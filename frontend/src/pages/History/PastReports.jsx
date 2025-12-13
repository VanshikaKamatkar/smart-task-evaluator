import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  ChevronRight, 
  Search, 
  Loader2,
  Lock,
  Unlock
} from 'lucide-react';
import api from '../../api/axios';

export default function PastReports() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      // Fetching page 1, limit 20 for now
      const res = await api.get('/tasks?limit=20'); 
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to color-code the score
  const getScoreColor = (score) => {
    if (!score) return 'bg-gray-100 text-gray-500';
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evaluation History</h1>
          <p className="text-gray-500">View and manage your past AI code analyses.</p>
        </div>
        <Link 
          to="/dashboard/new-task" 
          className="inline-flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          + New Evaluation
        </Link>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading records...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No evaluations found</h3>
            <p className="text-gray-500 mt-1 max-w-sm">
              You haven't submitted any tasks yet. Create your first one to get started!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <div 
                key={task._id} 
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-gray-50 transition-colors gap-4"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${task.isPaid ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <Link to={`/dashboard/result/${task._id}`} className="block focus:outline-none">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                        {task.taskDescription || "Untitled Task"}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(task.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Middle: Stats Badges */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Score Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(task.aiScore)}`}>
                    Score: {task.aiScore ?? 'N/A'}
                  </div>

                  {/* Payment Status Badge */}
                  <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${task.isPaid ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                    {task.isPaid ? <Unlock className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                    {task.isPaid ? 'Premium' : 'Free'}
                  </div>

                  {/* Action Arrow (Desktop) */}
                  <Link 
                    to={`/dashboard/result/${task._id}`}
                    className="hidden sm:flex p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}