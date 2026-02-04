// src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        console.log('Handling OAuth callback...');
        
        // Get the session from URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Callback session:', { session, error });
        
        if (error) {
          console.error('Callback error:', error);
          navigate('/auth?error=' + encodeURIComponent(error.message));
          return;
        }
        
        if (session) {
          console.log('User authenticated:', session.user.email);
          navigate('/');
        } else {
          console.log('No session found');
          navigate('/auth');
        }
      } catch (error: any) {
        console.error('Callback failed:', error);
        navigate('/auth?error=' + encodeURIComponent(error.message));
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Completing login...</h2>
      <p>Please wait while we authenticate you.</p>
    </div>
  );
}

export default Callback;