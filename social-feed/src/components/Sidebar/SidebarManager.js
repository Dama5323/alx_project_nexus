// SidebarManager.js - Add this as a separate file or in your main component
class SidebarManager {
  constructor() {
    this.init();
  }
  
  init() {
    // Fix z-index on load
    this.fixZIndex();
    
    // Add resize listener
    window.addEventListener('resize', () => this.handleResize());
    
    // Add scroll listener for mobile
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Initialize mobile menu
    this.initMobileMenu();
  }
  
  fixZIndex() {
    // Ensure proper layering
    const elements = {
      'body': 0,
      '.sidebar-container': 100,
      '.left-sidebar': 100,
      '.centered-main-content': 10,
      '.mobile-menu-toggle': 1001,
      '.post-card-centered': 5,
      '.create-post-centered': 5
    };
    
    Object.entries(elements).forEach(([selector, zIndex]) => {
      const el = document.querySelector(selector);
      if (el) {
        el.style.zIndex = zIndex;
        el.style.position = 'relative'; // Ensure z-index works
      }
    });
  }
  
  handleResize() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      this.fixMobileLayout();
    } else {
      this.fixDesktopLayout();
    }
  }
  
  fixMobileLayout() {
    // Hide right sidebar on mobile
    const rightSidebar = document.querySelector('.right-sidebar');
    if (rightSidebar) {
      rightSidebar.style.display = 'none';
    }
    
    // Adjust main content
    const mainContent = document.querySelector('.centered-main-content');
    if (mainContent) {
      mainContent.style.width = '100%';
      mainContent.style.maxWidth = '100%';
      mainContent.style.padding = '0';
      mainContent.style.margin = '0';
    }
    
    // Fix body overflow
    document.body.style.overflowX = 'hidden';
    document.body.style.maxWidth = '100vw';
  }
  
  fixDesktopLayout() {
    // Show right sidebar
    const rightSidebar = document.querySelector('.right-sidebar');
    if (rightSidebar) {
      rightSidebar.style.display = 'block';
    }
    
    // Reset styles
    const mainContent = document.querySelector('.centered-main-content');
    if (mainContent) {
      mainContent.style.width = '';
      mainContent.style.maxWidth = '680px';
      mainContent.style.padding = '';
      mainContent.style.margin = '0 auto';
    }
  }
  
  handleScroll() {
    // Fix header/sidebar on scroll for mobile
    if (window.innerWidth <= 768) {
      const scrollY = window.scrollY;
      const sidebar = document.querySelector('.left-sidebar');
      
      if (sidebar && !sidebar.classList.contains('open')) {
        if (scrollY > 100) {
          sidebar.style.transform = 'translateY(-100%)';
        } else {
          sidebar.style.transform = '';
        }
      }
    }
  }
  
  initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.left-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        
        // Prevent body scroll when sidebar is open
        if (sidebar.classList.contains('open')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SidebarManager();
});