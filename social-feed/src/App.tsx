import React, { useState, useEffect } from 'react'; // ← ADD useEffect import
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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fix layout on mount - FIXED: Added useEffect
  useEffect(() => {
    fixLayoutIssues();
    
    // Fix on route changes
    const observer = new MutationObserver(fixLayoutIssues);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []); // ← This closing bracket was missing

  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="App">
                {/* Mobile Menu Toggle Button */}
                <button 
                  className="mobile-menu-toggle"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <i className="fas fa-bars"></i>
                </button>
                
                {/* Mobile Menu */}
                <MobileMenu />
                
                {/* Main App Layout */}
                <div className="app-container">
                  {/* Desktop Sidebar */}
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
                  
                  {/* Main Content Area - Using CenteredLayout */}
                  <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
                    sidebarOpen ? 'md:ml-64 lg:ml-80' : 'md:ml-0'
                  }`}>
                    <div className="max-w-6xl mx-auto p-4">
                      <Routes>
                        {/* Public routes */}
                        <Route path="/auth" element={
                          <PublicRoute>
                            <AuthPage />
                          </PublicRoute>
                        } />
                        
                        {/* Callback route */}
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