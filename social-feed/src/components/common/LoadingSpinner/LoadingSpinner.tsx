import React from 'react';
import './LoadingSpinner.css';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#1DA1F2',
  text,
}) => {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div
        className="loading-spinner__circle"
        style={{ borderTopColor: color }}
      />
      {text && <p className="loading-spinner__text">{text}</p>}
    </div>
  );
};