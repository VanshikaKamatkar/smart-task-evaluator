import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  ChevronLeft, 
  Loader2, 
  FileText 
} from 'lucide-react';
import api from '../../api/axios';

export default function TaskResult() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch Task Data on Mount
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data.task);
      } catch (err) {
        setError("Failed to load task results.");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  // 2. Handle "Fake Payment" / Unlock
  const handleUnlock = async () => {
    try {
      setProcessingPayment(true);
      // Calls your backend "markTaskPaid" endpoint
      const res = await api.post(`/tasks/${id}/pay`);
      
      // Update local state to show unlocked version immediately
      setTask(prev => ({ ...prev, isPaid: true }));
      alert("Payment Successful! Report Unlocked.");
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  if (error) return (
    <div className="text-center mt-10 text-red-600">
      <p>{error}</p>
      <Link to="/dashboard" className="text-indigo-600 underline mt-4 block">Back to Dashboard</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </Link>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {task.isPaid ? 'PREMIUM REPORT' : 'FREE PREVIEW'}
        </span>
      </div>

      {/* Score Card - Always Visible */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-indigo-900 p-8 text-center text-white">
          <h2 className="text-lg font-medium text-indigo-200 uppercase tracking-wider">AI Quality Score</h2>
          <div className="mt-4 flex justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-indigo-400 bg-indigo-800 shadow-2xl">
              <span className="text-5xl font-bold">{task.aiScore || 0}</span>
              <span className="absolute top-6 right-4 text-sm text-indigo-300">/100</span>
            </div>
          </div>
          <p className="mt-4 text-indigo-200 max-w-xl mx-auto">
            {task.aiScore > 80 ? "Excellent work! Your code is efficient and clean." : "Good effort, but there is room for optimization."}
          </p>
        </div>

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-gray-200">
          
          {/* Column 1: Strengths (Always Visible) */}
          <div className="p-8">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-6">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Key Strengths
            </h3>
            <ul className="space-y-4">
              {task.aiStrengths?.length > 0 ? (
                task.aiStrengths.map((point, i) => (
                  <li key={i} className="flex items-start text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    {point}
                  </li>
                ))
              ) : (
                <p className="text-gray-400 italic">No specific strengths detected.</p>
              )}
            </ul>
          </div>

          {/* Column 2: Improvements (BLURRED if not paid) */}
          <div className="relative p-8 bg-gray-50/50">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-6">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
              Areas for Improvement
            </h3>
            
            <div className={!task.isPaid ? "filter blur-sm select-none" : ""}>
              <ul className="space-y-4">
                {/* If paid, show real data. If not, show fake skeleton or real data blurred */}
                {(task.isPaid ? task.aiImprovements : task.aiImprovements.slice(0, 3)).map((point, i) => (
                  <li key={i} className="flex items-start text-gray-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    {point}
                  </li>
                ))}
                {!task.isPaid && <li className="text-gray-400">... and 3 more critical fixes.</li>}
              </ul>
            </div>

            {/* Paywall Overlay */}
            {!task.isPaid && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
                <Lock className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-900 font-semibold mb-1">Unlock Improvements</p>
                <p className="text-xs text-gray-500 mb-4">Pay to see critical bug fixes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Feedback Section (Bottom) */}
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
          <FileText className="w-5 h-5 mr-2 text-indigo-500" />
          Detailed AI Analysis
        </h3>
        
        <div className={`prose max-w-none text-gray-600 ${!task.isPaid ? "filter blur-md h-32 overflow-hidden" : ""}`}>
           {/* Render full text with line breaks */}
           {task.aiFullFeedback?.split('\n').map((line, i) => (
             <p key={i} className="mb-2">{line}</p>
           ))}
        </div>

        {/* CTA for Payment */}
        {!task.isPaid && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-white via-white/90 to-transparent pt-20">
            <div className="text-center p-6 max-w-md">
              <h3 className="text-xl font-bold text-gray-900">Unlock Full Report</h3>
              <p className="mt-2 text-gray-500 mb-6">
                Get detailed line-by-line feedback, security vulnerability checks, and performance optimization tips.
              </p>
              <button
                onClick={handleUnlock}
                disabled={processingPayment}
                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                {processingPayment ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Unlock className="w-5 h-5 mr-2" />
                    Unlock Now (Fake Pay)
                  </>
                )}
              </button>
              <p className="mt-4 text-xs text-gray-400">
                Secure payment powered by Razorpay (Test Mode)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}