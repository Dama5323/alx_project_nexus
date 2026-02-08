import React, { useState, FormEvent } from 'react';
import { Image, Smile, Video } from 'lucide-react';
import { createPost, PostData } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';

interface CreatePostProps {
  onPostCreated: (post: PostData) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      const newPost = await createPost({
        content,
        timestamp: new Date().toISOString(),
      });
      setContent('');
      onPostCreated(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-centered">
      <div className="user-avatar">
        <img 
          src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'} 
          alt="User" 
        />
      </div>
      <div className="post-input-container">
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            rows={3}
            className="post-textarea"
          />
          <div className="post-actions">
            <div className="media-options">
              <button type="button" className="media-btn">
                <Image size={20} />
              </button>
              <button type="button" className="media-btn">
                <Video size={20} />
              </button>
              <button type="button" className="media-btn">
                <Smile size={20} />
              </button>
            </div>
            <button
              type="submit"
              disabled={!content.trim() || loading}
              className="post-submit-btn"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;