import { useState } from 'react';
import { 
  Bug, 
  Play, 
  Check, 
  Copy, 
  AlertTriangle, 
  Terminal, 
  Loader2,
  Lightbulb
} from 'lucide-react';
import api from '../../api/axios';

// 1. Syntax Highlighter Imports
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const SUPPORTED_LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'c', label: 'C' },
];

export default function AiDebugger() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFix = async () => {
    if (!code.trim()) {
      setError("Please enter some code to fix.");
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const res = await api.post('/ai/fix-code', {
        language,
        code
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fix code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.fixedCode) {
      navigator.clipboard.writeText(result.fixedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bug className="w-6 h-6 text-red-500" />
          AI Bug Fixer
        </h1>
        <p className="text-gray-500">
          Paste your broken code, select the language, and let AI debug it for you instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* INPUT COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Input (Buggy Code)</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white py-1 px-3 border"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.label}</option>
              ))}
            </select>
          </div>

          <div className="relative group">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Paste your broken ${language} code here...`}
              className="w-full h-[500px] p-4 bg-[#1e1e1e] text-gray-300 font-mono text-sm rounded-xl border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none custom-scrollbar"
              spellCheck="false"
            />
          </div>

          <button
            onClick={handleFix}
            disabled={loading}
            className="w-full flex items-center justify-center py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Debugging...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Fix My Code
              </>
            )}
          </button>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* OUTPUT COLUMN */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">AI Solution</label>
          
          {!result ? (
            // Empty State
            <div className="h-[500px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400">
              <Terminal className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Waiting for code to analyze...</p>
            </div>
          ) : (
            // Result State
            <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              
              {/* 1. Issues Found Header */}
              <div className="bg-red-50 p-4 border-b border-red-100">
                <h3 className="text-sm font-semibold text-red-800 flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Issues Detected
                </h3>
                <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                  {result.issuesFound.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>

              {/* 2. Fixed Code Viewer (UPDATED) */}
              <div className="flex-1 bg-[#1e1e1e] relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700">
                  <span className="text-xs text-gray-400 font-mono">fixed_{language}.{language === 'python' ? 'py' : 'js'}</span>
                  <button 
                    onClick={copyToClipboard}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* --- FIX START: Replaced <pre> with SyntaxHighlighter --- */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                  <SyntaxHighlighter 
                    language={language} 
                    style={vs2015}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      background: 'transparent', // Blends with parent bg
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                  >
                    {result.fixedCode}
                  </SyntaxHighlighter>
                </div>
                {/* --- FIX END --- */}

              </div>

              {/* 3. Explanation Footer */}
              <div className="bg-indigo-50 p-4 border-t border-indigo-100">
                <h3 className="text-sm font-semibold text-indigo-900 flex items-center mb-1">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  What Changed?
                </h3>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  {result.explanation}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}