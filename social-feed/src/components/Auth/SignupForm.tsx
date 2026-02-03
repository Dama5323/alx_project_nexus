import React, { useState } from 'react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import './AuthForms.css';

export const SignupForm: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const { signup, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    // Validation
    if (!name.trim()) {
      setValidationError('Name is required');
      return;
    }
    
    if (!email.trim()) {
      setValidationError('Email is required');
      return;
    }
    
    if (!password) {
      setValidationError('Password is required');
      return;
    }
    
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    console.log('Attempting signup...');
    const result = await signup(name, email, password);
    
    if (result.success) {
      console.log('Signup successful!');
      // Optionally redirect or show success message
      alert('Signup successful! You can now login.');
      onSwitchToLogin(); // Switch to login form
    } else {
      console.log('Signup failed:', result.error);
    }
  };

  return (
    <div className="auth-form">
      <h2>Create Account</h2>
      
      {(error || validationError) && (
        <div className="auth-error">
          {error || validationError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            disabled={loading}
          />
        </div>
        
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
            placeholder="Enter password (min. 6 characters)"
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
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
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
      
      <div className="auth-switch">
        Already have an account?{' '}
        <button 
          type="button" 
          onClick={onSwitchToLogin}
          className="switch-link"
          disabled={loading}
        >
          Log In
        </button>
      </div>
    </div>
  );
};