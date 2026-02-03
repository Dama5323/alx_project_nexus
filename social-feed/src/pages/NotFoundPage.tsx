import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import './NotFoundPage.css';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-page__content">
        <h1 className="not-found-page__title">404</h1>
        <h2 className="not-found-page__subtitle">Page Not Found</h2>
        <p className="not-found-page__text">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-page__actions">
          <Button variant="primary" size="lg" onClick={() => navigate('/')}>
            Go Home
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};