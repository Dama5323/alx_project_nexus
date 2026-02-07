import { useQuery, useMutation } from '@apollo/client';
import { GET_FEED } from '../graphql/queries/feedQueries';
import { CREATE_POST } from '../graphql/mutations/postMutations';
import { LIKE_POST, UNLIKE_POST } from '../graphql/mutations/reactionMutations';
import { ADD_COMMENT } from '../graphql/mutations/commentMutations';
import { REPOST } from '../graphql/mutations/repostMutations';
import { SHARE_POST } from '../graphql/mutations/shareMutations';
import { useState, useMemo, useRef, useEffect } from 'react';
import { PostActions } from '../components/Post/PostActions';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../components/notifications/NotificationBell';
import { PostAnalytics } from '../components/Post/PostAnalytics';
import BookmarkButton from '../components/engagement/BookmarkButton';
import FollowButton from '../components/engagement/FollowButton';
import TrendingSidebar from '../components/trending/TrendingSidebar';
import CreatePost from '../components/Post/CreatePost';
import PostComponent from '../components/Post/Post';
import { getPosts, generateSamplePosts } from '../services/postService';

// Define Post type interface
interface PostType {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: any[];
  shares: number;
  reposts: number;
  views: number;
  isLiked: boolean;
  isReposted: boolean;
  isSaved: boolean;
  images?: string[];
  video?: string;
}

function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for posts (for CreatePost component)
  const [localPosts, setLocalPosts] = useState<PostType[]>([]);
  const [loadingLocalPosts, setLoadingLocalPosts] = useState(true);
  
  // Convert PostData to PostType
  const convertToPostType = (postData: any): PostType => {
    return {
      id: postData.id || Date.now().toString(),
      content: postData.content || '',
      author: postData.author || {
        id: '1',
        name: 'Current User',
        username: '@currentuser',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
      },
      likes: postData.likes || 0,
      comments: postData.comments || [],
      shares: postData.shares || 0,
      reposts: postData.reposts || 0,
      views: postData.views || 0,
      isLiked: postData.isLiked || false,
      isReposted: postData.isReposted || false,
      isSaved: postData.isSaved || false,
      images: postData.images || [],
      video: postData.video,
    };
  };
  
  // Fetch local posts on component mount
  useEffect(() => {
    const fetchLocalPosts = async () => {
      try {
        setLoadingLocalPosts(true);
        const postsData = await getPosts();
        const convertedPosts = postsData.map(convertToPostType);
        setLocalPosts(convertedPosts);
      } catch (error) {
        console.error('Error fetching local posts:', error);
      } finally {
        setLoadingLocalPosts(false);
      }
    };
    
    fetchLocalPosts();
  }, []);
  
  // Handle new post created from CreatePost component
  const handlePostCreated = (newPostData: any) => {
    const newPost = convertToPostType(newPostData);
    setLocalPosts([newPost, ...localPosts]);
  };
  
  // Generate sample posts
  const handleGenerateSamplePosts = async () => {
    try {
      const samplePostsData = await generateSamplePosts();
      const convertedPosts = samplePostsData.map(convertToPostType);
      setLocalPosts(convertedPosts);
    } catch (error) {
      console.error('Error generating sample posts:', error);
    }
  };
  
  // GraphQL queries and mutations
  const { loading, error, data } = useQuery(GET_FEED, {
    variables: { first: 10 }
  });
  
  const [createPost] = useMutation(CREATE_POST, {
    refetchQueries: [{ query: GET_FEED, variables: { first: 10 } }]
  });

  const [repost] = useMutation(REPOST, {
    refetchQueries: [{ query: GET_FEED, variables: { first: 10 } }],
  });

  const [sharePost] = useMutation(SHARE_POST, {
    refetchQueries: [{ query: GET_FEED, variables: { first: 10 } }],
  });
  
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_FEED, variables: { first: 10 } }]
  });

  // Memoize posts to prevent recreation on every render
  const posts: PostType[] = useMemo(() => {
    return data?.feed?.edges.map((edge: any) => edge.node) || [];
  }, [data]);

  // Handle like/unlike
  const handleLikeClick = async (postId: string) => {
    const post = posts.find((p: PostType) => p.id === postId);
    if (!post) return;
    
    if (post.isLiked) {
      await unlikePost({ variables: { postId } });
    } else {
      await likePost({ variables: { postId } });
    }
  };

  // Handle comment
  const handleCommentSubmit = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    try {
      await addComment({
        variables: { postId, content },
      });
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Add comment failed:', error);
    }
  };

  // Handle repost
  const handleRepost = async (postId: string) => {
    try {
      const result = await repost({ 
        variables: { 
          postId,
          comment: null
        } 
      });
      
      console.log('Repost successful:', result);
      
      // Show success feedback
      if (result.data?.repost) {
        console.log('Post reposted! New repost count:', result.data.repost.reposts);
      }
    } catch (error: any) {
      console.error('Repost failed:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError
      });
      
      alert(`Failed to repost: ${error.message}`);
    }
  };

  // Handle share
  const handleShare = async (postId: string) => {
    try {
      const result = await sharePost({ 
        variables: { 
          postId, 
          platform: 'web', 
          message: 'Check out this post!' 
        } 
      });

      console.log('Share result:', result);
      
      if (result.data?.sharePost?.success) {
        const shareUrl = result.data.sharePost.shareUrl || 
                         `${window.location.origin}/post/${postId}`;
        
        console.log('Share URL:', shareUrl);
        
        // Try to use Web Share API
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Check out this post',
              text: result.data.sharePost.message || 'Check out this post!',
              url: shareUrl,
            });
          } catch (shareError: any) {
            // User cancelled share - that's okay
            if (shareError.name !== 'AbortError') {
              // Fallback: copy to clipboard
              await navigator.clipboard.writeText(shareUrl);
              alert('Link copied to clipboard!');
            }
          }
        } else {
          // Fallback for browsers without Web Share API
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        }
      } else {
        alert('Share failed: ' + (result.data?.sharePost?.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Share failed details:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError
      });
      
      alert(`Share failed: ${error.message}`);
    }
  };

  // Handle save
  const handleSave = async (postId: string) => {
    console.log('Save post:', postId);
  };

  // Handle profile edit navigation - ADDED: Using this function
  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    navigate('/profile/edit');
  };

  // Handle image upload - FIXED: null check for files - ADDED: Using this function
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedImages: string[] = [];

    for (let i = 0; i < Math.min(files.length, 4); i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        alert(`Image ${file.name} is too large (max 5MB)`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('http://localhost:4000/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedImages.push(data.url);
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    setSelectedImages(prev => [...prev, ...uploadedImages]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle video upload - FIXED: null check for files - ADDED: Using this function
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('Video is too large (max 50MB)');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await fetch('http://localhost:4000/api/upload/video', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedVideo(data.url);
      }
    } catch (error) {
      console.error('Video upload error:', error);
    } finally {
      setUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  // Handle create post via GraphQL - ADDED: Using this function
  const handleCreatePost = async () => {
    if (!newPostContent.trim() && selectedImages.length === 0 && !selectedVideo) {
      alert('Please add content, images, or video');
      return;
    }

    try {
      await createPost({ 
        variables: { 
          content: newPostContent,
          images: selectedImages,
          video: selectedVideo 
        } 
      });
      
      setNewPostContent('');
      setSelectedImages([]);
      setSelectedVideo(null);
    } catch (err) {
      console.error('Post creation failed:', err);
    }
  };

  // Loading states
  if (loading) return <div>Loading...</div>;
  if (error) {
    console.error('GraphQL Error:', error);
    // Fallback to local posts when GraphQL fails
    return (
      <div className="max-w-2xl mx-auto">
        {/* Create Post Section */}
        <div className="mb-6">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>

        {/* Posts Feed */}
        {loadingLocalPosts ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : localPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts yet. Be the first to post!</p>
            <button 
              onClick={handleGenerateSamplePosts}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Generate Sample Posts
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {localPosts.map((post) => (
              <PostComponent 
                key={post.id} 
                post={post}
                onLike={() => console.log('Like post:', post.id)}
                onComment={() => console.log('Comment on post:', post.id)}
                onRepost={() => console.log('Repost:', post.id)}
                onShare={() => console.log('Share post:', post.id)}
                onSave={() => console.log('Save post:', post.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      display: 'flex',
      gap: '20px',
      paddingTop: '80px'
    }}>
      {/* Left Sidebar - User Info & Navigation */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        {user && (
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=1d9bf0&color=fff`} 
                  alt="Profile"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '12px'
                  }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>{user.name || user.email}</h3>
                  <span style={{ color: '#536471', fontSize: '14px' }}>
                    @{user.username || user.email?.split('@')[0] || 'user'}
                  </span>
                </div>
              </div>
            </Link>
            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <Link 
                to="/bookmarks"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#333',
                  fontSize: '14px'
                }}
              >
                <span>🔖</span>
                Bookmarks
              </Link>
              <Link 
                to="/notifications"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#333',
                  fontSize: '14px'
                }}
              >
                <span>🔔</span>
                Notifications
              </Link>
              <Link 
                to="/analytics"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#333',
                  fontSize: '14px'
                }}
              >
                <span>📊</span>
                Analytics
              </Link>
            </div>
            
            {/* ADDED: Edit Profile Button */}
            <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <button 
                onClick={handleEditProfile}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#f0f2f5',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span>✏️</span>
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, maxWidth: '600px' }}>
        {/* Top Bar - ADDED: Uploading indicator */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'white',
          padding: '15px 20px',
          borderBottom: '1px solid #eee',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '20px' }}>Home</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* ADDED: Uploading indicator */}
            {uploading && (
              <div style={{
                padding: '4px 12px',
                background: '#e3f2fd',
                color: '#1976d2',
                borderRadius: '20px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span>⏳</span>
                Uploading...
              </div>
            )}
            
            <NotificationBell />
            
            {user && (
              <>
                <button 
                  onClick={logout}
                  style={{
                    padding: '8px 16px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Also show CreatePost component for local posts */}
        <div style={{ marginBottom: '20px' }}>
          <CreatePost onPostCreated={handlePostCreated} />
          
          {/* ADDED: Simple post creation form using handleCreatePost */}
          <div style={{
            background: 'white',
            padding: '15px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's happening?"
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                marginBottom: '10px'
              }}
            />
            
            {/* ADDED: Image upload button using handleImageUpload */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '8px 12px',
                  background: '#f0f2f5',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                📷 Add Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              
              {/* ADDED: Video upload button using handleVideoUpload */}
              <button 
                onClick={() => videoInputRef.current?.click()}
                style={{
                  padding: '8px 12px',
                  background: '#f0f2f5',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                🎥 Add Video
              </button>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                style={{ display: 'none' }}
              />
            </div>
            
            {/* Show selected images */}
            {selectedImages.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {selectedImages.map((img, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img 
                      src={img} 
                      alt="Selected" 
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <button
                      onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Show selected video */}
            {selectedVideo && (
              <div style={{ marginBottom: '10px', position: 'relative' }}>
                <video
                  src={selectedVideo}
                  controls
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    borderRadius: '8px'
                  }}
                />
                <button
                  onClick={() => setSelectedVideo(null)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '25px',
                    height: '25px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
            )}
            
            {/* ADDED: Create post button using handleCreatePost */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleCreatePost}
                disabled={uploading || (!newPostContent.trim() && selectedImages.length === 0 && !selectedVideo)}
                style={{
                  padding: '8px 20px',
                  background: '#1d9bf0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: uploading ? 0.6 : 1
                }}
              >
                {uploading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
          
          {/* Show local posts if GraphQL posts are empty */}
          {posts.length === 0 && !loadingLocalPosts && localPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts yet. Be the first to post!</p>
              <button 
                onClick={handleGenerateSamplePosts}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Generate Sample Posts
              </button>
            </div>
          )}
        </div>

        {/* Display Posts - GraphQL posts first, then local posts */}
        <div>
          {/* GraphQL Posts */}
          {posts.map((post: PostType) => (
            <div key={post.id} style={{
              borderBottom: '1px solid #eee',
              padding: '20px',
              background: 'white',
              borderRadius: '8px',
              marginBottom: '15px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              {/* Author */}
              <div style={{display: 'flex', alignItems: 'flex-start', marginBottom: '15px'}}>
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    marginRight: '12px',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{fontWeight: 'bold', fontSize: '15px'}}>
                        {post.author.name}
                      </div>
                      <div style={{color: '#536471', fontSize: '14px'}}>
                        @{post.author.username}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <FollowButton 
                        userId={post.author.id}
                        isFollowing={false}
                        size="sm"
                      />
                      <BookmarkButton 
                        postId={post.id}
                        isBookmarked={post.isSaved}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Post Content */}
              <div style={{fontSize: '15px', lineHeight: '1.5', margin: '10px 0'}}>
                {post.content.split(/(@\w+|#\w+)/).map((part, index) => {
                  if (part.match(/^@\w+/)) {
                    return (
                      <Link 
                        key={index} 
                        to={`/profile/${part.substring(1)}`}
                        style={{color: '#1d9bf0', fontWeight: '500', textDecoration: 'none'}}
                      >
                        {part}
                      </Link>
                    );
                  } else if (part.match(/^#\w+/)) {
                    return (
                      <Link 
                        key={index} 
                        to={`/hashtag/${encodeURIComponent(part.substring(1))}`}
                        style={{color: '#1d9bf0', fontWeight: '500', textDecoration: 'none'}}
                      >
                        {part}
                      </Link>
                    );
                  }
                  return <span key={index}>{part}</span>;
                })}
              </div>
              
              {/* Images */}
              {post.images?.map((img: string, i: number) => (
                <img 
                  key={i} 
                  src={img} 
                  alt="" 
                  style={{
                    maxWidth: '100%',
                    borderRadius: '12px',
                    marginTop: '10px',
                    maxHeight: '400px',
                    objectFit: 'cover'
                  }} 
                />
              ))}
              
              {/* Video */}
              {post.video && (
                <video 
                  src={post.video}
                  controls
                  style={{
                    maxWidth: '100%',
                    borderRadius: '12px',
                    marginTop: '10px',
                    maxHeight: '400px'
                  }}
                />
              )}
              
              {/* Post Stats & Analytics */}
              <div style={{
                marginTop: '15px',
                color: '#536471',
                fontSize: '14px',
                display: 'flex',
                gap: '20px',
                alignItems: 'center'
              }}>
                <span>{post.likes} Likes</span>
                <span>{post.comments?.length || 0} Comments</span>
                <span>{post.shares} Shares</span>
                <span>{post.reposts || 0} Reposts</span>
                <span>{post.views} Views</span>
              </div>
              
              {/* Use PostActions Component */}
              <div style={{ marginTop: '15px' }}>
                <PostActions
                  postId={post.id}
                  likes={post.likes}
                  comments={post.comments?.length || 0}
                  reposts={post.reposts || 0}
                  shares={post.shares || 0}
                  isLiked={post.isLiked}
                  isReposted={post.isReposted}
                  isSaved={post.isSaved}
                  onLike={() => handleLikeClick(post.id)}
                  onComment={() => {
                    const input = document.querySelector(`input[data-post-id="${post.id}"]`) as HTMLInputElement;
                    if (input) input.focus();
                  }}
                  onRepost={() => handleRepost(post.id)}
                  onShare={() => handleShare(post.id)}
                  onSave={() => handleSave(post.id)}
                />
              </div>

              {/* Post Analytics (for post owner) */}
              {user?.id === post.author.id && (
                <div style={{ marginTop: '15px' }}>
                  <PostAnalytics 
                    postId={post.id}
                    isOwner={true}
                  />
                </div>
              )}
              
              {/* Comment Input */}
              <div style={{
                marginTop: '15px',
                borderTop: '1px solid #eee',
                paddingTop: '12px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    data-post-id={post.id}
                    placeholder="Add a comment... Use @ to mention someone"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs(prev => ({
                      ...prev,
                      [post.id]: e.target.value
                    }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCommentSubmit(post.id);
                      }
                    }}
                    style={{
                      flexGrow: 1,
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#1d9bf0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Comment
                  </button>
                </div>
              </div>
              
              {/* Display Comments */}
              {post.comments?.length > 0 && (
                <div style={{ marginTop: '15px', paddingLeft: '60px' }}>
                  <div style={{ color: '#536471', fontSize: '14px', marginBottom: '8px' }}>
                    Comments ({post.comments.length})
                  </div>
                  {post.comments.map((comment: any, index: number) => (
                    <div key={comment.id || index} style={{
                      marginBottom: '10px',
                      padding: '8px',
                      background: '#f7f9f9',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <img 
                          src={comment.author?.avatar} 
                          alt={comment.author?.name}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            marginRight: '8px'
                          }}
                        />
                        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>
                          {comment.author?.name || 'Unknown User'}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', margin: 0 }}>{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Local Posts (when GraphQL has no posts) */}
          {posts.length === 0 && localPosts.length > 0 && (
            <div className="space-y-4">
              {localPosts.map((post) => (
                <PostComponent 
                  key={post.id} 
                  post={post}
                  onLike={() => console.log('Like post:', post.id)}
                  onComment={() => console.log('Comment on post:', post.id)}
                  onRepost={() => console.log('Repost:', post.id)}
                  onShare={() => console.log('Share post:', post.id)}
                  onSave={() => console.log('Save post:', post.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Trending */}
      <div style={{ width: '300px', flexShrink: 0 }}>
        <TrendingSidebar />
      </div>
    </div>
  );
}

export default HomePage;