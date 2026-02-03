import React from 'react';
import './EngagementChart.css';

export interface EngagementChartProps {
  postId: string;
}

export const EngagementChart: React.FC<EngagementChartProps> = ({ postId }) => {
  // Mock data - replace with actual data from API
  const data = [
    { hour: '00:00', views: 120, engagement: 45 },
    { hour: '04:00', views: 80, engagement: 30 },
    { hour: '08:00', views: 250, engagement: 95 },
    { hour: '12:00', views: 400, engagement: 180 },
    { hour: '16:00', views: 350, engagement: 150 },
    { hour: '20:00', views: 280, engagement: 110 },
  ];

  const maxViews = Math.max(...data.map((d) => d.views));
  const maxEngagement = Math.max(...data.map((d) => d.engagement));

  return (
    <div className="engagement-chart">
      <h3 className="engagement-chart__title">Engagement Over Time</h3>
      
      <div className="engagement-chart__legend">
        <div className="engagement-chart__legend-item">
          <span className="engagement-chart__legend-dot engagement-chart__legend-dot--views" />
          <span>Views</span>
        </div>
        <div className="engagement-chart__legend-item">
          <span className="engagement-chart__legend-dot engagement-chart__legend-dot--engagement" />
          <span>Engagement</span>
        </div>
      </div>

      <div className="engagement-chart__graph">
        {data.map((point, index) => (
          <div key={index} className="engagement-chart__bar-group">
            <div className="engagement-chart__bars">
              <div
                className="engagement-chart__bar engagement-chart__bar--views"
                style={{ height: `${(point.views / maxViews) * 100}%` }}
                title={`${point.views} views`}
              />
              <div
                className="engagement-chart__bar engagement-chart__bar--engagement"
                style={{ height: `${(point.engagement / maxEngagement) * 100}%` }}
                title={`${point.engagement} engagements`}
              />
            </div>
            <span className="engagement-chart__label">{point.hour}</span>
          </div>
        ))}
      </div>
    </div>
  );
};