import React, { useEffect, useState } from 'react';
import { formatNumber } from '../../utils/helpers/formatNumbers';
import './ViewsCounter.css';

export interface ViewsCounterProps {
  initialCount: number;
  animate?: boolean;
}

export const ViewsCounter: React.FC<ViewsCounterProps> = ({
  initialCount,
  animate = true,
}) => {
  const [count, setCount] = useState(animate ? 0 : initialCount);

  useEffect(() => {
    if (!animate) return;

    const duration = 1000;
    const steps = 60;
    const increment = initialCount / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(initialCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(increment * currentStep));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [initialCount, animate]);

  return (
    <div className="views-counter">
      <svg viewBox="0 0 24 24" width="16" height="16" className="views-counter__icon">
        <path
          fill="currentColor"
          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
        />
      </svg>
      <span className="views-counter__count">{formatNumber(count)}</span>
      <span className="views-counter__label">views</span>
    </div>
  );
};