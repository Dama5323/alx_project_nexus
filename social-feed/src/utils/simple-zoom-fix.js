// Simple zoom fix that doesn't break layouts
export function initializeZoomFix() {
  // Only run in browser
  if (typeof window === 'undefined') return;
  
  const fixZoomLayout = () => {
    // 1. Prevent horizontal scroll
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    
    // 2. Ensure body takes full width
    document.body.style.width = '100vw';
    document.body.style.maxWidth = '100vw';
    
    // 3. Debug info
    if (process.env.NODE_ENV === 'development') {
      const viewportWidth = window.innerWidth;
      const zoomLevel = Math.round((window.outerWidth / window.innerWidth) * 100);
      if (zoomLevel !== 100) {
        console.log(`Zoom level: ${zoomLevel}%, Viewport: ${viewportWidth}px`);
      }
    }
  };
  
  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixZoomLayout);
  } else {
    fixZoomLayout();
  }
  
  // Run on resize (zoom triggers resize)
  window.addEventListener('resize', fixZoomLayout);
  
  // Cleanup
  return () => window.removeEventListener('resize', fixZoomLayout);
}
