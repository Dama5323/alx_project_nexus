import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/Post/CreatePost';
import { createPost } from '../services/postService';
import { PostData } from '../services/postService';
import './ComposePage.css';

const ComposePage = () => {
  const navigate = useNavigate();
  const [isPosting, setIsPosting] = useState(false);

  const handlePostCreated = async (postData: PostData) => {
    try {
      setIsPosting(true);
      // Save the post
      await createPost(postData);
      // Redirect to home page after posting
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="compose-page">
      <div className="compose-header">
        <button 
          onClick={handleCancel}
          className="compose-cancel-btn"
          disabled={isPosting}
        >
          Cancel
        </button>
        <h1>Create Post</h1>
        <button 
          type="submit" 
          form="compose-form"
          className="compose-post-btn"
          disabled={isPosting}
        >
          {isPosting ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="compose-content">
        <CreatePost onPostCreated={handlePostCreated} />
        
        <div className="compose-tips">
          <h3>Posting Tips:</h3>
          <ul>
            <li>Use @username to mention other users</li>
            <li>Use #hashtag to join trending topics</li>
            <li>Share your thoughts, links, or media</li>
            <li>Be respectful and follow community guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComposePage;