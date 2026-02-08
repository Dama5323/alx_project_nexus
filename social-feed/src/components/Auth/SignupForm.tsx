// src/components/Auth/AuthPage.tsx (or wherever your AuthPage is)
import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const { 
    login, 
    signup, 
    loginWithGoogle, 
    loginWithLinkedIn,
    loading,
    error 
  } = useAuthContext(); // USE CONTEXT HERE
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await signup(name, email, password);
      }
      
      if (result.success) {
        navigate('/');
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Google login clicked');
    try {
      const result = await loginWithGoogle();
      console.log('Google login result:', result);
      
      if (result.success) {
        // The OAuth flow will handle redirect automatically
      } else {
        alert(`Google login failed: ${result.error}`);
      }
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  const handleLinkedInLogin = async () => {
    console.log('LinkedIn login clicked');
    try {
      const result = await loginWithLinkedIn();
      console.log('LinkedIn login result:', result);
      
      if (!result.success) {
        alert(result.error);
      }
    } catch (err) {
      console.error('LinkedIn login error:', err);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2>Welcome to Social Feed</h2>
      <p>Sign in to your account</p>
      
      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      {/* Social Login Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '10px',
            background: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          Continue with Google
        </button>
        
        <button
          onClick={handleLinkedInLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '10px',
            background: '#0077B5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          Continue with LinkedIn
        </button>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0', position: 'relative' }}>
        <hr style={{ border: 'none', borderTop: '1px solid #ccc' }} />
        <span style={{ 
          background: 'white', 
          padding: '0 10px', 
          position: 'relative', 
          top: '-10px' 
        }}>
          or
        </span>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleEmailLogin}>
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', fontSize: '16px' }}
              required={!isLogin}
            />
          </div>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#1d9bf0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Loading...' : (isLogin ? 'Log In' : 'Sign Up')}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: 'none',
            border: 'none',
            color: '#1d9bf0',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;