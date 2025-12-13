import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Code, FileText, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

export default function SubmitTask() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('idle'); // idle | saving | evaluating | done

  const [formData, setFormData] = useState({
    taskDescription: '',
    code: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.taskDescription.trim() || !formData.code.trim()) {
      setError("Please provide both a description and code.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create the Task
      setStep('saving');
      const createRes = await api.post('/tasks', {
        taskDescription: formData.taskDescription,
        code: formData.code
      });
      
      const taskId = createRes.data.task._id;

      // 2. Trigger AI Evaluation
      setStep('evaluating');
      await api.post(`/tasks/${taskId}/evaluate`);

      // 3. Redirect to Results Page (We will build this in Phase 6.6)
      setStep('done');
      navigate(`/dashboard/result/${taskId}`);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong during evaluation.");
      setStep('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Evaluation</h1>
          <p className="text-gray-500">Submit your code for instant AI analysis.</p>
        </div>
      </div>

      {/* Main Form Area */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Column: Description */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2 text-indigo-500" />
              Task Description
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Explain what this code is supposed to do (e.g., "A function to reverse a linked list").
            </p>
            <textarea
              className="flex-1 w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm transition-all"
              placeholder="Enter task requirements here..."
              value={formData.taskDescription}
              onChange={(e) => setFormData({...formData, taskDescription: e.target.value})}
              disabled={loading}
            />
          </div>
        </div>

        {/* Right Column: Code Editor */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          <div className="bg-[#1e1e1e] p-4 rounded-xl shadow-lg border border-gray-700 flex-1 flex flex-col">
            <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
              <Code className="w-4 h-4 mr-2 text-blue-400" />
              Source Code
            </label>
            <textarea
              className="flex-1 w-full p-4 bg-[#252526] text-gray-100 font-mono text-sm border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none outline-none custom-scrollbar"
              placeholder="// Paste your JavaScript/Python/Java code here..."
              spellCheck="false"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              disabled={loading}
            />
          </div>
        </div>

      </form>

      {/* Footer / Action Bar */}
      <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500">
          {error && (
            <span className="flex items-center text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </span>
          )}
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`flex items-center px-8 py-3 rounded-lg text-white font-medium shadow-md transition-all ${
            loading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {step === 'saving' ? 'Saving...' : 'AI Analyzing...'}
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2 fill-current" />
              Run Analysis
            </>
          )}
        </button>
      </div>
    </div>
  );
}