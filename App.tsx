
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './authContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import JIESA from './pages/JIESA';
import DCIESA from './pages/DCIESA';
import Treasury from './pages/Treasury';
import Secretary from './pages/Secretary';
import Spiritual from './pages/Spiritual';
import MediaCenter from './pages/MediaCenter';
import AdminSettings from './pages/AdminSettings';
import Events from './pages/Events';
import Leaders from './pages/Leaders';
import Patrimony from './pages/Patrimony';
import Hymns from './pages/Hymns';
import DEBOS from './pages/DEBOS';
import SHIESA from './pages/SHIESA';
import SOSIESA from './pages/SOSIESA';
import BackgroundMusic from './components/BackgroundMusic';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode, roles?: UserRole[] }> = ({ children, roles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  // SUPER_ADMIN tem acesso total sempre
  if (user.role === UserRole.SUPER_ADMIN) return <Layout>{children}</Layout>;
  
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  
  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <BackgroundMusic />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/leaders" element={<ProtectedRoute><Leaders /></ProtectedRoute>} />
        <Route path="/jiesa" element={<ProtectedRoute roles={[UserRole.LEADER, UserRole.SECRETARY, UserRole.ASSISTANT]}><JIESA /></ProtectedRoute>} />
        <Route path="/dciesa" element={<ProtectedRoute roles={[UserRole.SUPERVISOR, UserRole.LEADER, UserRole.SECRETARY]}><DCIESA /></ProtectedRoute>} />
        <Route path="/debos" element={<ProtectedRoute roles={[UserRole.LEADER, UserRole.SECRETARY]}><DEBOS /></ProtectedRoute>} />
        <Route path="/shiesa" element={<ProtectedRoute roles={[UserRole.LEADER, UserRole.SECRETARY]}><SHIESA /></ProtectedRoute>} />
        <Route path="/sosiesa" element={<ProtectedRoute roles={[UserRole.LEADER, UserRole.SECRETARY]}><SOSIESA /></ProtectedRoute>} />
        <Route path="/treasury" element={<ProtectedRoute roles={[UserRole.TREASURER, UserRole.SECRETARY]}><Treasury /></ProtectedRoute>} />
        <Route path="/secretary" element={<ProtectedRoute roles={[UserRole.SECRETARY, UserRole.LEADER]}><Secretary /></ProtectedRoute>} />
        <Route path="/patrimony" element={<ProtectedRoute roles={[UserRole.ASSISTANT, UserRole.LEADER]}><Patrimony /></ProtectedRoute>} />
        <Route path="/spiritual" element={<ProtectedRoute><Spiritual /></ProtectedRoute>} />
        <Route path="/hymns" element={<ProtectedRoute><Hymns /></ProtectedRoute>} />
        <Route path="/media" element={<ProtectedRoute roles={[UserRole.LEADER, UserRole.SECRETARY]}><MediaCenter /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute roles={[UserRole.SUPER_ADMIN]}><AdminSettings /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;
