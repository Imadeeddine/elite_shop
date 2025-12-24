
import React, { useState, useEffect, useMemo } from 'react';
import { AppProvider } from './context/AppContext';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import AdminLayout from './layouts/AdminLayout';
import BuyerLayout from './layouts/BuyerLayout';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return user?.isAdmin ? <AdminLayout /> : <BuyerLayout />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
