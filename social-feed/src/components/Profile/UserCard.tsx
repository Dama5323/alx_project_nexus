// src/components/Profile/UserCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    bio?: string;
    isFollowing: boolean;
  };
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="user-card">
      <div className="user-card__avatar">
        <Link to={`/profile/${user.username}`}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="md"
          />
        </Link>
      </div>
      
      <div className="user-card__info">
        <Link to={`/profile/${user.username}`} className="user-card__name-link">
          <h3 className="user-card__name">{user.name}</h3>
          <span className="user-card__username">@{user.username}</span>
        </Link>
        
        {user.bio && (
          <p className="user-card__bio">{user.bio}</p>
        )}
      </div>
      
      <div className="user-card__actions">
        <Button
          variant={user.isFollowing ? 'secondary' : 'primary'}
          size="sm"
        >
          {user.isFollowing ? 'Following' : 'Follow'}
        </Button>
      </div>
    </div>
  );
};