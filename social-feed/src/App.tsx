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
import MobileMenu from './components/Sidebar/MobileMenu'; 
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import ComposePage from './pages/ComposePage';

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
                {/* Mobile Menu */}
                <MobileMenu />
                
                {/* Desktop Sidebar with toggle button */}
                <div className="hidden md:block">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button 
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      style={{
                        padding: '8px',
                        background: '#f0f2f5',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '10px'
                      }}
                    >
                      {sidebarOpen ? '◀ Hide' : '▶ Show'} Sidebar
                    </button>
                    <Sidebar />
                  </div>
                </div>
                
                {/* Adjust main content based on sidebar state */}
                <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
                  sidebarOpen ? 'md:ml-64 lg:ml-80' : 'md:ml-0'
                }`}>
                  <div className="max-w-4xl mx-auto p-4">
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

                      <Route path="/compose" element={
                        <ProtectedRoute>
                          <ComposePage />
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
                      
                      {/* Error routes */}
                      <Route path="/404" element={<NotFoundPage />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default App;