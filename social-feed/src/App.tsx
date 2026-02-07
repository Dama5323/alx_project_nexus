// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Sidebar from './components/Sidebar/Sidebar';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';

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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="app-container">
                {/* Mobile Menu Toggle */}
                <button 
                  className="mobile-menu-toggle"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? '✕' : '☰'}
                </button>

                {/* Sidebar */}
                <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
                  <Sidebar />
                </div>

                {/* Main Content */}
                <div className="main-content">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/auth" element={
                      <PublicRoute>
                        <AuthPage />
                      </PublicRoute>
                    } />
                    
                    {/* Callback route */}
                    <Route path="/auth/callback" element={<Callback />} />
                    
                    {/* Protected routes */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Profile routes */}
                    <Route path="/profile/:userId" element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Navigate to="/profile/me" replace />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile/edit" element={
                      <ProtectedRoute>
                        <EditProfilePage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Other protected routes */}
                    <Route path="/notifications" element={
                      <ProtectedRoute>
                        <NotificationsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                      <ProtectedRoute>
                        <AnalyticsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/bookmarks" element={
                      <ProtectedRoute>
                        <BookmarksPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/trending" element={
                      <ProtectedRoute>
                        <TrendingPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/hashtag/:hashtag" element={
                      <ProtectedRoute>
                        <HashtagPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/messages" element={
                      <ProtectedRoute>
                        <MessagesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/search" element={
                      <ProtectedRoute>
                        <SearchPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Add these missing routes for the sidebar */}
                    <Route path="/explore" element={
                      <ProtectedRoute>
                        <TrendingPage /> {/* Using TrendingPage for now, create ExplorePage later */}
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <div className="settings-container">
                          <div className="settings-content">
                            <h1>Settings</h1>
                            <p>Settings page coming soon!</p>
                          </div>
                        </div>
                      </ProtectedRoute>
                    } />
                    <Route path="/help" element={
                      <ProtectedRoute>
                        <div className="help-container">
                          <div className="help-content">
                            <h1>Help & Support</h1>
                            <p>Help page coming soon!</p>
                          </div>
                        </div>
                      </ProtectedRoute>
                    } />
                    <Route path="/compose" element={
                      <ProtectedRoute>
                        <div className="compose-container">
                          <div className="compose-content">
                            <h1>Create Post</h1>
                            <p>Compose page coming soon! Use the create post in HomePage for now.</p>
                          </div>
                        </div>
                      </ProtectedRoute>
                    } />
                    
                    {/* Error routes */}
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </div>
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default App;