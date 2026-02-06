import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_ANALYTICS } from '../graphql/queries/engagementQueries';
import { useAuth } from '../hooks/useAuth';
import { formatNumber, calculateEngagementRate } from '../utils/analytics/index';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('week');
  
  const { data, loading, error } = useQuery(GET_USER_ANALYTICS, {
    variables: { userId: user?.id },
    skip: !user
  });

  const analytics = data?.userAnalytics;

  // Mock data for charts (replace with actual data)
  const engagementData = [
    { day: 'Mon', likes: 240, comments: 45, shares: 12 },
    { day: 'Tue', likes: 320, comments: 67, shares: 18 },
    { day: 'Wed', likes: 290, comments: 52, shares: 15 },
    { day: 'Thu', likes: 380, comments: 78, shares: 22 },
    { day: 'Fri', likes: 410, comments: 89, shares: 25 },
    { day: 'Sat', likes: 350, comments: 72, shares: 19 },
    { day: 'Sun', likes: 280, comments: 58, shares: 16 }
  ];

  const audienceData = [
    { name: '18-24', value: 35 },
    { name: '25-34', value: 40 },
    { name: '35-44', value: 15 },
    { name: '45+', value: 10 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading analytics. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your performance and engagement</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-8">
        {['day', 'week', 'month', 'year'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg capitalize ${
              period === p
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Followers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(analytics?.followers || 0)}
              </p>
              <p className="text-sm text-green-600 mt-1">↑ 12% from last month</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Engagement Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics?.engagement?.toFixed(1) || '0.0'}%
              </p>
              <p className="text-sm text-green-600 mt-1">↑ 3.2% from last week</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Posts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analytics?.posts || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total published</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Following</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(analytics?.following || 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Accounts you follow</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Engagement Chart */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likes" fill="#3b82f6" name="Likes" />
                <Bar dataKey="comments" fill="#10b981" name="Comments" />
                <Bar dataKey="shares" fill="#8b5cf6" name="Shares" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Age Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
  <PieChart>
    <Pie
      data={audienceData}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
    />
    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
  </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Posts */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
        <div className="space-y-4">
          {analytics?.topPosts?.slice(0, 5).map((post: any) => (
            <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <p className="text-gray-900 line-clamp-2">{post.content}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span>❤️ {formatNumber(post.likes)}</span>
                  <span>💬 {formatNumber(post.comments)}</span>
                  <span>🔄 {formatNumber(post.shares)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {calculateEngagementRate(post.likes, post.comments, post.shares, 1000).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">Engagement rate</p>
              </div>
            </div>
          )) || (
            <p className="text-gray-600 text-center py-8">No posts data available yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;