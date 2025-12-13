import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DashboardHome from './pages/Dashboard/DashboardHome';
import SubmitTask from './pages/Task/SubmitTask'; 
import TaskResult from './pages/Task/TaskResult';
import PastReports from './pages/History/PastReports';
import AiDebugger from './pages/Dashboard/AiDebugger';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              
              {/* Connected the real SubmitTask component here */}
              <Route path="new-task" element={<SubmitTask />} />
              <Route path="result/:id" element={<TaskResult />} />
              
              <Route path="history" element={<PastReports />} />
              <Route path="debug" element={<AiDebugger />} />
            </Route>
          </Route>
          
          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;