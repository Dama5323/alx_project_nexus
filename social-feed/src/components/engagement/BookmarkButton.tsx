import React, { useState } from 'react';
import { useBookmark } from '../../hooks/useEngagement';

interface BookmarkButtonProps {
  postId: string;
  isBookmarked: boolean;
  size?: 'sm' | 'md' | 'lg';
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  postId,
  isBookmarked: initialIsBookmarked,
  size = 'md',
  onBookmarkChange
}) => {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const { toggleBookmark, loading } = useBookmark();

  const handleBookmarkToggle = async () => {
    if (loading) return;
    
    try {
      const result = await toggleBookmark(postId, isBookmarked);
      if (result?.success) {
        const newState = !isBookmarked;
        setIsBookmarked(newState);
        onBookmarkChange?.(newState);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  return (
    <button
      onClick={handleBookmarkToggle}
      disabled={loading}
      className={`
        rounded-full transition-colors duration-200
        ${sizeClasses[size]}
        ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
      `}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg
          className={`h-5 w-5 ${isBookmarked ? 'fill-current text-blue-600' : 'text-gray-400'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isBookmarked ? 0 : 2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )}
    </button>
  );
};

export default BookmarkButton;