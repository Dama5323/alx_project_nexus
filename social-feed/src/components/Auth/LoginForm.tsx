import React, { useState } from 'react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import './AuthForms.css';

export const LoginForm: React.FC<{ onSwitchToSignup: () => void }> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(''); // Local form error state
  const { login, loading, error: authError } = useAuth(); // Destructure error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validation
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    console.log('Login attempt...');
    const result = await login(email, password);
    
    if (result.success) {
      console.log('Login successful!');
      // You can add redirect logic here
    } else {
      console.log('Login failed:', result.error);
      setFormError(result.error || 'Login failed');
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      
      {(authError || formError) && (
        <div className="auth-error">
          {authError || formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          isLoading={loading}
          disabled={loading}
          className="auth-button"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
      
      <div className="auth-switch">
        Don't have an account?{' '}
        <button 
          type="button" 
          onClick={onSwitchToSignup}
          className="switch-link"
          disabled={loading}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};