// src/hooks/useZoomFix.ts
import { useEffect } from 'react';

export const useZoomFix = () => {
  useEffect(() => {
    // Fix common zoom issues
    const fixZoomIssues = () => {
      // 1. Prevent horizontal scroll
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflowX = 'hidden';
      
      // 2. Ensure proper viewport scaling
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5, user-scalable=yes'
        );
      }
      
      // 3. Fix images and media
      document.querySelectorAll('img, video, iframe').forEach(el => {
        (el as HTMLElement).style.maxWidth = '100%';
        (el as HTMLElement).style.height = 'auto';
      });
      
      // 4. Log zoom level for debugging
      const zoomLevel = Math.round((window.outerWidth / window.innerWidth) * 100);
      if (zoomLevel !== 100) {
        console.log(`Current zoom: ${zoomLevel}%`);
      }
    };
    
    // Run on mount
    fixZoomIssues();
    
    // Run on resize (which includes zoom)
    window.addEventListener('resize', fixZoomIssues);
    
    return () => {
      window.removeEventListener('resize', fixZoomIssues);
    };
  }, []);
};