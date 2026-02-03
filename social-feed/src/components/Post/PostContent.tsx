import React, { useState } from 'react';
import './PostContent.css';

export interface PostContentProps {
  content: string;
  images?: string[];
  video?: string;
  maxLength?: number;
}

export const PostContent: React.FC<PostContentProps> = ({
  content,
  images = [],
  video,
  maxLength = 280,
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const shouldTruncate = content.length > maxLength;
  const displayContent = showFullContent || !shouldTruncate
    ? content
    : `${content.slice(0, maxLength)}...`;

  const linkifyContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const mentionRegex = /@(\w+)/g;
    const hashtagRegex = /#(\w+)/g;

    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    let match;
    
    // Use a single regex to match all patterns
    const combinedRegex = /(https?:\/\/[^\s]+)|@(\w+)|#(\w+)/g;
    
    while ((match = combinedRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const fullMatch = match[0];
      
      if (fullMatch.match(urlRegex)) {
        parts.push(
          <a
            key={match.index}
            href={fullMatch}
            target="_blank"
            rel="noopener noreferrer"
            className="post-content__link"
          >
            {fullMatch}
          </a>
        );
      } else if (fullMatch.startsWith('@')) {
        parts.push(
          <a
            key={match.index}
            href={`/profile/${fullMatch.slice(1)}`}
            className="post-content__mention"
          >
            {fullMatch}
          </a>
        );
      } else if (fullMatch.startsWith('#')) {
        parts.push(
          <a
            key={match.index}
            href={`/hashtag/${fullMatch.slice(1)}`}
            className="post-content__hashtag"
          >
            {fullMatch}
          </a>
        );
      }
      
      lastIndex = combinedRegex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  };

  const getImageLayout = (count: number) => {
    if (count === 1) return 'single';
    if (count === 2) return 'double';
    if (count === 3) return 'triple';
    if (count === 4) return 'quad';
    return 'single';
  };

  return (
    <div className="post-content">
      <p className="post-content__text">
        {linkifyContent(displayContent)}
      </p>
      
      {shouldTruncate && !showFullContent && (
        <button
          className="post-content__read-more"
          onClick={() => setShowFullContent(true)}
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
          >
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
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image}
                alt={`Post content ${index + 1}`} 
                className="post-content__image"
                loading="lazy"
              />
              {images.length > 4 && index === 3 && (
                <div className="post-content__image-overlay">
                  +{images.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedImage !== null && (
        <div className="post-content__lightbox" onClick={() => setSelectedImage(null)}>
          <button className="post-content__lightbox-close" onClick={() => setSelectedImage(null)}>
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
            >
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
};