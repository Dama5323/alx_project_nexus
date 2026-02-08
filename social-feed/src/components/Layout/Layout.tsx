// src/components/Layout/Layout.tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';

const Layout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/login') || 
                     location.pathname.includes('/signup') || 
                     location.pathname.includes('/auth');

  return (
    <>
      {!isAuthPage && <Navigation />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;