// src/components/Auth/AuthPage.tsx
import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css'; // Create a CSS file for better styling

const AuthPage: React.FC = () => {
  const { 
    login, 
    signup, 
    loginWithGoogle, 
    loginWithLinkedIn,
    loading,
    error 
  } = useAuthContext();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        if (!name.trim()) {
          alert('Please enter your name');
          return;
        }
        result = await signup(name, email, password);
      }
      
      if (result?.success) {
        navigate('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        alert(`Google login failed: ${result.error}`);
      }
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  const handleLinkedInLogin = async () => {
    try {
      const result = await loginWithLinkedIn();
      if (!result.success) {
        alert(result.error);
      }
    } catch (err) {
      console.error('LinkedIn login error:', err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome to Social Feed</h1>
          <p>Sign {isLogin ? 'in' : 'up'} to your account</p>
        </div>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        {/* Social Login Buttons */}
        <div className="social-auth">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="social-btn google-btn"
          >
            <span className="social-icon">G</span>
            Continue with Google
          </button>
          
          <button
            onClick={handleLinkedInLogin}
            disabled={loading}
            className="social-btn linkedin-btn"
          >
            <span className="social-icon">in</span>
            Continue with LinkedIn
          </button>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}
          
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? 'Loading...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-switch">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="switch-btn"
            disabled={loading}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>

        {/* Optional: Add terms/privacy links for signup */}
        {!isLogin && (
          <div className="auth-footer">
            <p className="terms-text">
              By signing up, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;