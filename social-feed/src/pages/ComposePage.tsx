import React, { useState } from 'react';
import './ComposePage.css';

const ComposePage: React.FC = () => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    console.log('Post content:', content);
    // Add post creation logic here
  };

  return (
    <div className="compose-container">
      <div className="compose-content">
        <h1>Create Post</h1>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="compose-textarea"
        />
        <button onClick={handleSubmit} className="compose-submit">
          Post
        </button>
      </div>
    </div>
  );
};

export default ComposePage;