// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthPage } from './components/Auth';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useAuthContext } from './context/AuthContext';
import './App.css';
import Callback from './pages/AuthCallback';
import EditProfilePage from './pages/EditProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BookmarksPage from './pages/BookmarksPage';
import TrendingPage from './pages/TrendingPage';
import HashtagPage from './pages/HashtagPage';
import MessagesPage from './pages/MessagesPage';
import SearchPage from './pages/SearchPage';
import MobileMenu from './components/Sidebar/MobileMenu';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import ComposePage from './pages/ComposePage';
import CenteredLayout from './components/Layout/CenteredLayout';
import { fixLayoutIssues } from './utils/layoutFix';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Single LayoutWrapper component - Remove the duplicate!
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // More comprehensive auth page check
  const isAuthPage = 
    location.pathname.startsWith('/login') || 
    location.pathname.startsWith('/signup') || 
    location.pathname.startsWith('/auth') ||
    location.pathname.includes('callback');

  // If it's an auth page, render just the centered auth container
  if (isAuthPage) {
    return (
      <div className="auth-page-container">
        {children}
      </div>
    );
  }

  // For non-auth pages, show the full layout with mobile menu
  return (
    <div className="App">
      {/* Mobile Menu Toggle Button - Only show on non-auth pages */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>
      
      {/* Mobile Menu - Only show on non-auth pages */}
      <MobileMenu />
      
      {/* Main App Layout */}
      <div className="app-container">
        {children}
      </div>
    </div>
  );
};

function App() {
  // Fix layout on mount
  useEffect(() => {
    fixLayoutIssues();
    
    // Fix on route changes
    const observer = new MutationObserver(fixLayoutIssues);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <LayoutWrapper>
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto transition-all duration-300">
                  <div className="max-w-6xl mx-auto p-4">
                    <Routes>
                      {/* Public routes - No navbar/sidebar on these */}
                      <Route path="/auth" element={
                        <PublicRoute>
                          <AuthPage />
                        </PublicRoute>
                      } />
                      <Route path="/login" element={
                        <PublicRoute>
                          <AuthPage />
                        </PublicRoute>
                      } />
                      <Route path="/signup" element={
                        <PublicRoute>
                          <AuthPage />
                        </PublicRoute>
                      } />
                      
                      {/* Callback route - Public */}
                      <Route path="/auth/callback" element={<Callback />} />
                      
                      {/* Protected routes with CenteredLayout */}
                      <Route path="/" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <HomePage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/explore" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <TrendingPage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                      
                      {/* Profile routes */}
                      <Route path="/profile/:userId" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <ProfilePage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Navigate to="/profile/me" replace />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/profile/edit" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <EditProfilePage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />

                      <Route path="/compose" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <ComposePage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                                                
                      {/* Other protected routes */}
                      <Route path="/notifications" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <NotificationsPage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/analytics" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <AnalyticsPage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/bookmarks" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <BookmarksPage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/trending" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <TrendingPage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/hashtag/:hashtag" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <HashtagPage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/messages" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <MessagesPage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/search" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <SearchPage />
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                      
                      {/* Settings and Help routes */}
                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <div className="settings-container">
                              <div className="settings-content">
                                <h1>Settings</h1>
                                <p>Settings page coming soon!</p>
                              </div>
                            </div>
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/help" element={
                        <ProtectedRoute>
                          <CenteredLayout showSidebars={true}>
                            <div className="help-container">
                              <div className="help-content">
                                <h1>Help & Support</h1>
                                <p>Help page coming soon!</p>
                              </div>
                            </div>
                          </CenteredLayout>
                        </ProtectedRoute>
                      } />
                                      
                      {/* Error routes */}
                      <Route path="/404" element={<NotFoundPage />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </div>
                </main>
              </LayoutWrapper>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default App;