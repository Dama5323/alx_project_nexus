import React from 'react';
import { Feed } from '../components/Feed';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
//import './HomePage.css';

export const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <ErrorBoundary>
        <Feed />
      </ErrorBoundary>
    </div>
  );
};