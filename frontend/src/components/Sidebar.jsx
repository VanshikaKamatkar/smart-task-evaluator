import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, LogOut, Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isMobile, closeMobileMenu }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: PlusCircle, label: 'New Evaluation', path: '/dashboard/new-task' },
    { icon: History, label: 'History', path: '/dashboard/history' },
    { icon: Code, label: 'AI Debugger', path: '/dashboard/debug' },
  ];

  const baseClasses = `fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
    isMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static lg:inset-0'
  }`;

  return (
    <div className={baseClasses}>
      {/* Logo Area */}
      <div className="flex items-center justify-center h-16 border-b border-gray-100">
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <Code className="w-6 h-6" />
          SmartEvaluator
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button (Bottom) */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;