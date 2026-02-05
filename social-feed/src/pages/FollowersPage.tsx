// src/pages/FollowersPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_FOLLOWERS } from '../graphql/queries/userQueries';
import { UserCard } from '../components/Profile/UserCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';

export const FollowersPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  
  const { data, loading } = useQuery(GET_USER_FOLLOWERS, {
    variables: { username }
  });

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading followers..." />;
  }

  return (
    <div className="followers-page">
      <div className="page-header">
        <h2>Followers</h2>
        <p>@{username}</p>
      </div>
      
      <div className="followers-list">
        {data?.user?.followers?.map((follower: any) => (
          <UserCard key={follower.id} user={follower} />
        ))}
      </div>
    </div>
  );
};