import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-800/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar isMobile={isSidebarOpen} closeMobileMenu={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex justify-between w-full lg:w-auto ml-auto items-center">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}