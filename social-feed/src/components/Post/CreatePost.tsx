import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Image, Smile, Video, X, Upload, FileUp } from 'lucide-react';
import { createPost, PostData } from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';

interface CreatePostProps {
  onPostCreated: (post: PostData) => void;
}

// Mock upload function - replace with actual API call in production
const mockUploadToServer = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In production, you would:
      // 1. Upload to Cloudinary, AWS S3, or your own server
      // 2. Get back a real URL
      
      // For now, we'll create a data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }, 1000);
  });
};

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const { user } = useAuth();

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (newImages.length + images.length > 4) {
      alert('You can upload up to 4 images only');
      return;
    }

    // Add new images
    setImages(prev => [...prev, ...newImages]);
    
    // Create previews
    newImages.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreviews(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset file input
    e.target.value = '';
  };

  // Handle video upload
  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('Video file size should be less than 50MB');
      return;
    }

    setVideo(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setVideoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    e.target.value = '';
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Remove video
  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  // Upload files to server (mock implementation)
  const uploadFiles = async (): Promise<{ images: string[], video?: string }> => {
    if (images.length === 0 && !video) return { images: [] };

    setUploading(true);
    const uploadedImages: string[] = [];
    
    try {
      // Upload images
      for (const image of images) {
        const imageUrl = await mockUploadToServer(image);
        uploadedImages.push(imageUrl);
      }
      
      // Upload video if exists
      let uploadedVideo: string | undefined;
      if (video) {
        uploadedVideo = await mockUploadToServer(video);
      }
      
      return { images: uploadedImages, video: uploadedVideo };
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0 && !video) {
      alert('Please add some content or media');
      return;
    }

    try {
      setLoading(true);
      
      // Upload files first
      const { images: uploadedImages, video: uploadedVideo } = await uploadFiles();
      
      // Create post with uploaded file URLs
      const newPost = await createPost({
        content,
        images: uploadedImages,
        video: uploadedVideo,
        timestamp: new Date().toISOString(),
      });
      
      // Reset form
      setContent('');
      setImages([]);
      setImagePreviews([]);
      setVideo(null);
      setVideoPreview(null);
      
      onPostCreated(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
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
          
          {/* Media Previews */}
          {(imagePreviews.length > 0 || videoPreview) && (
            <div className="media-previews">
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className={`image-previews-grid ${imagePreviews.length === 1 ? 'single' : 'multiple'}`}>
                  {imagePreviews.map((preview, index) => (
                    <div key={`image-${index}-${Date.now()}`} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-media-btn"
                        aria-label="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Video Preview */}
              {videoPreview && (
                <div className="video-preview" key={`video-${Date.now()}`}>
                  <video src={videoPreview} controls />
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="remove-media-btn video-remove-btn"
                  >
                    <X size={16} /> Remove Video
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="post-actions">
            <div className="media-options">
              {/* Image Upload */}
              <label className={`media-btn ${video !== null ? 'disabled' : ''}`} title="Add photos">
                <Image size={20} />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={video !== null || images.length >= 4}
                />
                {images.length > 0 && (
                  <span className="file-count">{images.length}/4</span>
                )}
              </label>
              
              {/* Video Upload */}
              <label className={`media-btn ${images.length > 0 ? 'disabled' : ''}`} title="Add video">
                <Video size={20} />
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ display: 'none' }}
                  disabled={images.length > 0 || video !== null}
                />
              </label>
              
              {/* Emoji button (placeholder) */}
              <button type="button" className="media-btn" title="Add emoji">
                <Smile size={20} />
              </button>
              
              {/* Upload Progress Indicator */}
              {uploading && (
                <div className="upload-progress">
                  <Upload size={16} className="upload-spinner" />
                  <span>Uploading...</span>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={(!content.trim() && images.length === 0 && !video) || loading || uploading}
              className="post-submit-btn"
            >
              {loading ? 'Posting...' : uploading ? 'Uploading...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;