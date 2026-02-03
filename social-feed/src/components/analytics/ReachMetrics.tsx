import React from 'react';
import { formatNumber, formatPercentage } from '../../utils/helpers/formatNumbers';
import './ReachMetrics.css';

export interface ReachMetricsProps {
  totalFollowers: number;
  reached: number;
  impressions: number;
}

export const ReachMetrics: React.FC<ReachMetricsProps> = ({
  totalFollowers,
  reached,
  impressions,
}) => {
  const reachPercentage = (reached / totalFollowers) * 100;
  const impressionsPerReach = impressions / reached;

  return (
    <div className="reach-metrics">
      <h3 className="reach-metrics__title">Reach Metrics</h3>

      <div className="reach-metrics__stats">
        <div className="reach-metrics__stat">
          <span className="reach-metrics__stat-value">{formatNumber(reached)}</span>
          <span className="reach-metrics__stat-label">Accounts Reached</span>
        </div>

        <div className="reach-metrics__stat">
          <span className="reach-metrics__stat-value">{reachPercentage.toFixed(1)}%</span>
          <span className="reach-metrics__stat-label">of Followers</span>
        </div>

        <div className="reach-metrics__stat">
          <span className="reach-metrics__stat-value">
            {impressionsPerReach.toFixed(1)}x
          </span>
          <span className="reach-metrics__stat-label">Avg. Impressions</span>
        </div>
      </div>

      <div className="reach-metrics__bar">
        <div
          className="reach-metrics__bar-fill"
          style={{ width: `${Math.min(reachPercentage, 100)}%` }}
        >
          <span className="reach-metrics__bar-label">
            {formatNumber(reached)} / {formatNumber(totalFollowers)}
          </span>
        </div>
      </div>

      <div className="reach-metrics__breakdown">
        <div className="reach-metrics__breakdown-item">
          <span className="reach-metrics__breakdown-label">Followers</span>
          <div className="reach-metrics__breakdown-bar">
            <div
              className="reach-metrics__breakdown-bar-fill reach-metrics__breakdown-bar-fill--followers"
              style={{ width: `${(reached / totalFollowers) * 100}%` }}
            />
          </div>
          <span className="reach-metrics__breakdown-value">
            {formatPercentage(reached, totalFollowers)}
          </span>
        </div>

        <div className="reach-metrics__breakdown-item">
          <span className="reach-metrics__breakdown-label">Non-Followers</span>
          <div className="reach-metrics__breakdown-bar">
            <div
              className="reach-metrics__breakdown-bar-fill reach-metrics__breakdown-bar-fill--non-followers"
              style={{ width: `${((reached - totalFollowers) / reached) * 100}%` }}
            />
          </div>
          <span className="reach-metrics__breakdown-value">
            {formatPercentage(reached - totalFollowers, reached)}
          </span>
        </div>
      </div>
    </div>
  );
};