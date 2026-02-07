import React, { useState, useMemo, useCallback } from 'react';
import './PostContent.css';

export interface PostContentProps {
  content: string;
  images?: string[];
  video?: string;
  maxLength?: number;
  onMentionClick?: (username: string) => void;
  onHashtagClick?: (tag: string) => void;
}

export const PostContent: React.FC<PostContentProps> = ({
  content,
  images = [],
  video,
  maxLength = 280,
  onMentionClick,
  onHashtagClick,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<number[]>([]); // Changed to array

  const shouldTruncate = content.length > maxLength;
  const displayContent = showFullContent || !shouldTruncate
    ? content
    : `${content.slice(0, maxLength)}...`;

  // Memoize linkified content for performance
  const linkifiedContent = useMemo(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    // REMOVED unused variables:
    // const mentionRegex = /@(\w+)/g;  // Remove this line
    // const hashtagRegex = /#(\w+)/g; // Remove this line
    
    const combinedRegex = /(https?:\/\/[^\s]+)|@(\w+)|#(\w+)/g;
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    
    while ((match = combinedRegex.exec(displayContent)) !== null) {
      if (match.index > lastIndex) {
        parts.push(displayContent.substring(lastIndex, match.index));
      }
      
      const fullMatch = match[0];
      
      if (fullMatch.match(urlRegex)) {
        // Sanitize URL in production
        const cleanUrl = fullMatch.replace(/[<>"']/g, '');
        parts.push(
          <a
            key={`url-${match.index}`}
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="post-content__link"
            onClick={(e) => {
              e.preventDefault();
              // Track outbound clicks in production
              window.open(cleanUrl, '_blank');
            }}
          >
            {fullMatch}
          </a>
        );
      } else if (fullMatch.startsWith('@')) {
        const username = fullMatch.slice(1);
        parts.push(
          <button
            key={`mention-${match.index}`}
            className="post-content__mention"
            onClick={() => onMentionClick?.(username)}
          >
            {fullMatch}
          </button>
        );
      } else if (fullMatch.startsWith('#')) {
        const tag = fullMatch.slice(1);
        parts.push(
          <button
            key={`hashtag-${match.index}`}
            className="post-content__hashtag"
            onClick={() => onHashtagClick?.(tag)}
          >
            {fullMatch}
          </button>
        );
      }
      
      lastIndex = combinedRegex.lastIndex;
    }
    
    if (lastIndex < displayContent.length) {
      parts.push(displayContent.substring(lastIndex));
    }
    
    return parts;
  }, [displayContent, onMentionClick, onHashtagClick]);

  const handleImageError = useCallback((index: number) => {
    setImageErrors(prev => prev.includes(index) ? prev : [...prev, index]);
  }, []);

  const getImageLayout = (count: number) => {
    if (count === 1) return 'single';
    if (count === 2) return 'double';
    if (count === 3) return 'triple';
    if (count === 4) return 'quad';
    return 'single';
  };

  return (
    <div className="post-content" data-testid="post-content">
      <div className="post-content__text">
        {linkifiedContent}
      </div>
      
      {shouldTruncate && !showFullContent && (
        <button
          className="post-content__read-more"
          onClick={() => setShowFullContent(true)}
          aria-expanded={showFullContent}
        >
          Show more
        </button>
      )}

      {video && (
        <div className="post-content__media">
          <video
            className="post-content__video"
            controls
            src={video}
            preload="metadata"
            aria-label="Post video content"
          >
            <track kind="captions" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {images.length > 0 && (
        <div className={`post-content__images post-content__images--${getImageLayout(images.length)}`}>
          {images.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className="post-content__image-wrapper"
              role="button"
              tabIndex={0}
              onClick={() => !imageErrors.includes(index) && setSelectedImage(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  !imageErrors.includes(index) && setSelectedImage(index);
                }
              }}
              aria-label={`View image ${index + 1} of ${images.length}`}
            >
              {imageErrors.includes(index) ? (
                <div className="post-content__image-error">
                  🖼️ Failed to load
                </div>
              ) : (
                <>
                  <img
                    src={image}
                    alt={`Post content ${index + 1}`}
                    className="post-content__image"
                    loading="lazy"
                    onError={() => handleImageError(index)}
                  />
                  {images.length > 4 && index === 3 && (
                    <div className="post-content__image-overlay">
                      +{images.length - 4}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedImage !== null && !imageErrors.includes(selectedImage) && (
        <div 
          className="post-content__lightbox" 
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button 
            className="post-content__lightbox-close"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image viewer"
          >
            ✕
          </button>
          <img
            src={images[selectedImage]}
            alt={`Full size ${selectedImage + 1}`}
            className="post-content__lightbox-image"
          />
          {selectedImage > 0 && (
            <button
              className="post-content__lightbox-prev"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage - 1);
              }}
              aria-label="Previous image"
            >
              ‹
            </button>
          )}
          {selectedImage < images.length - 1 && (
            <button
              className="post-content__lightbox-next"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage + 1);
              }}
              aria-label="Next image"
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
};