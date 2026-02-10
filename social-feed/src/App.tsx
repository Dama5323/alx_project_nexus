import React from 'react';
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
import './styles/zoom-global-fix.css'; // ADD THIS
import Callback from './pages/AuthCallback';
import EditProfilePage from './pages/EditProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BookmarksPage from './pages/BookmarksPage';
import TrendingPage from './pages/TrendingPage';
import HashtagPage from './pages/HashtagPage';
import MessagesPage from './pages/MessagesPage';
import SearchPage from './pages/SearchPage';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import ComposePage from './pages/ComposePage';
import CenteredLayout from './components/Layout/CenteredLayout';
import Navigation from './components/Navigation/Navigation';


// --- Helper Components ---
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// --- The Main Layout Logic ---
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuthContext();

  const isAuthPage = 
    location.pathname.startsWith('/login') || 
    location.pathname.startsWith('/signup') || 
    location.pathname.startsWith('/auth') ||
    location.pathname.includes('callback');

  if (isAuthPage) {
    return <div className="auth-page-container">{children}</div>;
  }

  return (
    <div className="App">
      {user && <Navigation />}
      <div className="app-main-content">
        {children}
      </div>
    </div>
  );
};

// --- App Component ---
function App() {
  
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <LayoutWrapper>
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
                  <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
                  <Route path="/signup" element={<PublicRoute><AuthPage /></PublicRoute>} />
                  <Route path="/auth/callback" element={<Callback />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={<ProtectedRoute><CenteredLayout showSidebars={true}><HomePage /></CenteredLayout></ProtectedRoute>} />
                  <Route path="/explore" element={<ProtectedRoute><CenteredLayout showSidebars={true}><TrendingPage /></CenteredLayout></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><CenteredLayout showSidebars={true}><NotificationsPage /></CenteredLayout></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><CenteredLayout showSidebars={true}><MessagesPage /></CenteredLayout></ProtectedRoute>} />
                  <Route path="/bookmarks" element={<ProtectedRoute><CenteredLayout showSidebars={true}><BookmarksPage /></CenteredLayout></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><CenteredLayout showSidebars={true}><AnalyticsPage /></CenteredLayout></ProtectedRoute>} />
                  <Route path="/profile/:userId" element={<ProtectedRoute><CenteredLayout showSidebars={true}><ProfilePage /></CenteredLayout></ProtectedRoute>} />
                  <Route path="/profile/edit" element={<ProtectedRoute><CenteredLayout showSidebars={true}><EditProfilePage /></CenteredLayout></ProtectedRoute>} />
                  <Route path="/compose" element={<ProtectedRoute><CenteredLayout showSidebars={true}><ComposePage /></CenteredLayout></ProtectedRoute>} />
                  <Route path="/search" element={<ProtectedRoute><CenteredLayout showSidebars={true}><SearchPage /></CenteredLayout></ProtectedRoute>} />
                  <Route path="/hashtag/:hashtag" element={<ProtectedRoute><CenteredLayout showSidebars={true}><HashtagPage /></CenteredLayout></ProtectedRoute>} />

                  {/* Fallback */}
                  <Route path="/profile" element={<ProtectedRoute><Navigate to="/profile/me" replace /></ProtectedRoute>} />
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </LayoutWrapper>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default App;