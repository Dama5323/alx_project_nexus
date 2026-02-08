// src/utils/layoutFix.js
export function fixLayoutIssues() {
  // Fix sidebar z-index
  const sidebar = document.querySelector('.left-sidebar, .sidebar');
  if (sidebar) {
    sidebar.style.zIndex = '100';
    sidebar.style.background = 'white';
  }
  
  // Fix main content
  const mainContent = document.querySelector('.centered-main-content');
  if (mainContent) {
    mainContent.style.position = 'relative';
    mainContent.style.zIndex = '1';
  }
  
  // Fix user names
  document.querySelectorAll('.user-name, .post-user-info strong').forEach(el => {
    el.style.overflow = 'visible';
    el.style.whiteSpace = 'normal';
    el.style.maxWidth = '100%';
  });
  
  console.log('Layout issues fixed');
}