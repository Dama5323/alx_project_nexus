import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_TRENDING_HASHTAGS = gql`
  query GetTrendingHashtags($limit: Int!) {
    trendingHashtags(limit: $limit)
  }
`;

interface HashtagSuggestionsProps {
  content: string;
  onSelectHashtag: (hashtag: string) => void;
}

const HashtagSuggestions: React.FC<HashtagSuggestionsProps> = ({ content, onSelectHashtag }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const { data } = useQuery(GET_TRENDING_HASHTAGS, {
    variables: { limit: 5 }
  });

  useEffect(() => {
    const words = content.split(' ');
    const lastWord = words[words.length - 1];
    
    if (lastWord.startsWith('#')) {
      const searchTerm = lastWord.substring(1).toLowerCase();
      const trendingHashtags = data?.trendingHashtags || [];
      
      const filtered = trendingHashtags
        .filter((tag: string) => 
          tag.toLowerCase().includes(searchTerm) && 
          tag.toLowerCase() !== searchTerm
        )
        .slice(0, 5);
      
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [content, data]);

  if (suggestions.length === 0) return null;

  return (
    <div className="hashtag-suggestions">
      <div className="suggestions-list">
        {suggestions.map((hashtag, index) => (
          <button
            key={index}
            className="suggestion-item"
            onClick={() => onSelectHashtag(`#${hashtag}`)}
          >
            #{hashtag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HashtagSuggestions;