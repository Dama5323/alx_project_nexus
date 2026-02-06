import React, { useState } from 'react';
//import { useBookmark } from '../../hooks/useEngagement';
import { useFollow } from '../../hooks/useEngagement';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  isFollowing: initialIsFollowing,
  variant = 'primary',
  size = 'md',
  onFollowChange
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { followUser, unfollowUser } = useFollow();

  const handleFollowToggle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
        onFollowChange?.(false);
      } else {
        await followUser(userId);
        setIsFollowing(true);
        onFollowChange?.(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: isFollowing 
      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
      : 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: isFollowing
      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      : 'bg-gray-800 text-white hover:bg-gray-900',
    outline: isFollowing
      ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
      : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`
        rounded-full font-medium transition-colors duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </span>
      ) : isFollowing ? (
        'Following'
      ) : (
        'Follow'
      )}
    </button>
  );
};

export default FollowButton;