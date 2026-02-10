// src/scripts/fix-zoom-build.js
// Run this script before build to fix zoom issues in CSS files

const fs = require('fs');
const path = require('path');

function convertPxToRem(cssContent) {
  // Convert px to rem (16px base)
  return cssContent.replace(/(\d+)px/g, (match, px) => {
    const pxValue = parseInt(px);
    if (pxValue === 0) return '0';
    if (pxValue === 1) return '1px'; // Keep 1px borders
    return `${pxValue / 16}rem`;
  });
}

function addZoomMediaQueries(cssContent) {
  const zoomFixes = `
/* Zoom-specific fixes */
@media (max-width: 30rem) { /* High zoom */
  * {
    min-width: 0 !important;
  }
}

@media (min-width: 120rem) { /* Low zoom */
  .container {
    max-width: 120rem !important;
  }
}

@supports (overflow: clip) {
  /* Modern browser fixes */
  html {
    overflow: clip;
  }
}
`;
  return cssContent + zoomFixes;
}

function processCSSFiles() {
  const srcDir = path.join(__dirname, '..');
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.css')) {
        console.log(`Processing: ${filePath}`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Apply fixes
        content = convertPxToRem(content);
        content = addZoomMediaQueries(content);
        
        fs.writeFileSync(filePath, content);
      }
    });
  }
  
  walkDir(srcDir);
  console.log('✅ Zoom fixes applied to CSS files');
}

// Run if called directly
if (require.main === module) {
  processCSSFiles();
}

module.exports = { convertPxToRem, addZoomMediaQueries };