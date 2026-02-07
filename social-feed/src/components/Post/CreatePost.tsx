import React, { useState, FormEvent } from 'react';
import { Image, Smile, Video, Calendar, MapPin } from 'lucide-react';
import { createPost, PostData } from '../../services/postService';

interface CreatePostProps {
  onPostCreated: (post: PostData) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
          rows={3}
        />
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex space-x-3">
            <button type="button" className="text-blue-500 hover:bg-blue-50 p-2 rounded-full">
              <Image size={20} />
            </button>
            <button type="button" className="text-green-500 hover:bg-green-50 p-2 rounded-full">
              <Video size={20} />
            </button>
            <button type="button" className="text-yellow-500 hover:bg-yellow-50 p-2 rounded-full">
              <Smile size={20} />
            </button>
            <button type="button" className="text-purple-500 hover:bg-purple-50 p-2 rounded-full">
              <Calendar size={20} />
            </button>
            <button type="button" className="text-red-500 hover:bg-red-50 p-2 rounded-full">
              <MapPin size={20} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;