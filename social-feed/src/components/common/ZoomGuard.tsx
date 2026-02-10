import React, { ReactNode, useEffect } from 'react';
import { ZoomDebugger } from '../../utils/zoomDebugger';

interface ZoomGuardProps {
  children: ReactNode;
  debug?: boolean;
  autoFix?: boolean;
}

export const ZoomGuard: React.FC<ZoomGuardProps> = ({ 
  children, 
  debug = false,
  autoFix = true 
}) => {
  useEffect(() => {
    if (debug || autoFix) {
      const handleResize = () => {
        if (debug) {
          ZoomDebugger.logZoomInfo();
        }
        
        if (autoFix) {
          const fixes = ZoomDebugger.fixCommonIssues();
          if (fixes.length > 0 && debug) {
            console.log('Auto-fixes applied:', fixes);
          }
        }
      };
      
      // Initial check
      handleResize();
      
      // Check on resize (zoom triggers resize)
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [debug, autoFix]);
  
  return <>{children}</>;
};