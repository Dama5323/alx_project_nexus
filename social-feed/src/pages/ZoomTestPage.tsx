import React, { useEffect } from 'react';

const ZoomTestPage: React.FC = () => {
  useEffect(() => {
    // Log viewport info for debugging
    console.log('=== ZOOM TEST ===');
    console.log('Viewport width:', window.innerWidth);
    console.log('Device pixel ratio:', window.devicePixelRatio);
    console.log('Document width:', document.documentElement.clientWidth);
    
    // Check for layout issues
    const checkLayout = () => {
      const bodyWidth = document.body.clientWidth;
      const htmlWidth = document.documentElement.clientWidth;
      const viewportWidth = window.innerWidth;
      
      console.log(`Body: ${bodyWidth}px, HTML: ${htmlWidth}px, Viewport: ${viewportWidth}px`);
      
      if (bodyWidth > viewportWidth) {
        console.warn('⚠️ Body is wider than viewport!');
      }
    };
    
    checkLayout();
    window.addEventListener('resize', checkLayout);
    
    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  return (
    <div style={{ 
      padding: '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <h1>Zoom Test Page</h1>
      <p>Test at 100% zoom and 50% zoom.</p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr 320px',
        gap: '24px',
        marginTop: '2rem'
      }}>
        <div style={{ background: '#e3f2fd', padding: '1rem', borderRadius: '8px' }}>
          Left Sidebar (280px)
        </div>
        <div style={{ background: '#f3e5f5', padding: '1rem', borderRadius: '8px' }}>
          Main Content (flexible)
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <p>This should stay centered and not overflow.</p>
          </div>
        </div>
        <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px' }}>
          Right Sidebar (320px)
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3e0' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Zoom to 50% (Ctrl + -)</li>
          <li>Zoom to 200% (Ctrl + +)</li>
          <li>Check Console for layout info</li>
          <li>No horizontal scroll should appear</li>
        </ol>
      </div>
    </div>
  );
};

export default ZoomTestPage;
