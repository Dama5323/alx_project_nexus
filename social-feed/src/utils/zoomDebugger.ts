// src/utils/zoomDebugger.ts
export class ZoomDebugger {
  static logZoomInfo() {
    const zoomLevel = Math.round((window.outerWidth / window.innerWidth) * 100);
    const dpr = window.devicePixelRatio;
    const viewportWidth = window.innerWidth;
    const documentWidth = document.documentElement.clientWidth;
    
    console.group('🔍 Zoom Debug Info');
    console.log(`Zoom Level: ${zoomLevel}%`);
    console.log(`Device Pixel Ratio: ${dpr}`);
    console.log(`Viewport Width: ${viewportWidth}px`);
    console.log(`Document Width: ${documentWidth}px`);
    console.log(`Body Width: ${document.body.clientWidth}px`);
    console.log(`Has Horizontal Scroll: ${document.body.scrollWidth > viewportWidth}`);
    
    // Check for problematic elements
    const wideElements = Array.from(document.querySelectorAll('*'))
      .filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > viewportWidth;
      })
      .map(el => ({
        tag: el.tagName,
        class: el.className,
        width: el.getBoundingClientRect().width,
        id: el.id || 'no-id'
      }));
    
    if (wideElements.length > 0) {
      console.warn('⚠️ Elements wider than viewport:', wideElements);
    }
    
    console.groupEnd();
    return { zoomLevel, dpr, viewportWidth, hasIssues: wideElements.length > 0 };
  }
  
  static highlightProblematicElements() {
    // Add red border to elements causing overflow
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > window.innerWidth) {
        (el as HTMLElement).style.outline = '2px solid red !important';
        (el as HTMLElement).style.outlineOffset = '-1px !important';
      }
    });
  }
  
  static fixCommonIssues() {
    // Auto-fix common problems
    const fixes = [];
    
    // Fix body overflow
    if (document.body.scrollWidth > window.innerWidth) {
      document.body.style.overflowX = 'hidden';
      fixes.push('Fixed body overflow');
    }
    
    // Fix images
    document.querySelectorAll('img').forEach(img => {
      if (!img.style.maxWidth) {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        fixes.push('Fixed image sizing');
      }
    });
    
    // Fix tables
    document.querySelectorAll('table').forEach(table => {
      if (!table.style.overflowX) {
        table.style.overflowX = 'auto';
        table.style.display = 'block';
        fixes.push('Fixed table overflow');
      }
    });
    
    return fixes;
  }
}