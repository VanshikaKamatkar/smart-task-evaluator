import { Link } from 'react-router-dom';
import { 
  Code, 
  CheckCircle, 
  Zap, 
  Shield, 
  ArrowRight, 
  Bug, 
  BarChart 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Code className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">SmartEvaluator</span>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition">
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
            🚀 AI-Powered Code Analysis
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Master Your Code with <br/>
            <span className="text-indigo-600">Instant AI Feedback</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Stop guessing if your code is efficient. Get detailed scores, security checks, and optimization tips in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xl"
            >
              Evaluate My Code
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a 
              href="#features" 
              className="flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
            >
              View Features
            </a>
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to write better code</h2>
            <p className="mt-4 text-gray-600">Our AI engine analyzes every line to ensure quality and performance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-yellow-500" />}
              title="Instant Scoring"
              desc="Get a 0-100 quality score immediately based on efficiency, readability, and logic."
            />
            <FeatureCard 
              icon={<Bug className="w-6 h-6 text-red-500" />}
              title="AI Debugger"
              desc="Stuck on a bug? Paste your broken code and let our AI suggest the fix instantly."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-green-500" />}
              title="Security Checks"
              desc="Identify vulnerabilities and security risks before you push your code to production."
            />
            <FeatureCard 
              icon={<BarChart className="w-6 h-6 text-indigo-500" />}
              title="Detailed Feedback"
              desc="Don't just get a score. Get line-by-line recommendations on how to improve."
            />
            <FeatureCard 
              icon={<Code className="w-6 h-6 text-blue-500" />}
              title="Multi-Language"
              desc="Supports JavaScript, Python, Java, C++, and C out of the box."
            />
            <FeatureCard 
              icon={<CheckCircle className="w-6 h-6 text-purple-500" />}
              title="Progress Tracking"
              desc="Keep a history of all your evaluations and watch your coding skills grow over time."
            />
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to level up your coding skills?</h2>
          <p className="text-indigo-200 mb-10 text-lg">
            Join thousands of developers who use SmartEvaluator to write cleaner, faster, and safer code.
          </p>
          <Link 
            to="/signup" 
            className="inline-block bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition transform hover:-translate-y-1"
          >
            Start for Free
          </Link>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} SmartEvaluator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Simple sub-component for features
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition duration-300">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}