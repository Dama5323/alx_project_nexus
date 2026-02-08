// src/pages/HomePage.tsx
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
//import LinkedInPost from '../components/Post/LinkPost';
import './HomePage.css';

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

// Define simple post type for the new centered layout
interface SimplePost {
  id: string;
  userAvatar: string;
  username: string;
  handle: string;
  time: string;
  content: string;
  media?: string;
  comments: number;
  retweets: number;
  likes: number;
  video?: string;
  images?: string[];
}

const HomePage: React.FC = () => {
  // State for the new centered layout
  const [simplePosts, setSimplePosts] = useState<SimplePost[]>([
    {
      id: '1',
      userAvatar: 'https://res.cloudinary.com/dzyqof9it/image/upload/v1770419352/ava_ivuuzq.webp',
      username: 'Ivy Wanjiru',
      handle: '@ivywanjiru',
      time: '2 min ago',
      content: 'Hello World! This is my first post on the new centered layout.',
      comments: 5,
      retweets: 3,
      likes: 20
    },
    {
      id: '2',
      userAvatar: 'https://res.cloudinary.com/dzyqof9it/image/upload/v1770481206/ava2_dvty1g.jpg',
      username: 'React Developer',
      handle: 'reactdev',
      time: '1 hour ago',
      content: 'Just finished implementing the new centered layout! What do you think?',
      media: 'https://res.cloudinary.com/dzyqof9it/image/upload/v1770517289/sm_nexus_co2pr7.png',
      comments: 12,
      retweets: 8,
      likes: 45
    }
  ]);
  
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
        avatar: 'https://res.cloudinary.com/dzyqof9it/image/upload/v1770481206/ava2_dvty1g.jpg'
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
  
  // Handle delete post for centered layout
  const handleDeletePost = (postId: string) => {
    setSimplePosts(simplePosts.filter(post => post.id !== postId));
  };

  // Handle new post in centered layout
  const handleNewPost = () => {
    if (newPostContent.trim() || selectedImages.length > 0 || selectedVideo) {
      const newPost: SimplePost = {
        id: Date.now().toString(),
        userAvatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
        username: user?.name || 'Current User',
        handle: user?.username || 'currentuser',
        time: 'just now',
        content: newPostContent,
        images: selectedImages,
        video: selectedVideo || undefined,
        comments: 0,
        retweets: 0,
        likes: 0
      };
      
      setSimplePosts([newPost, ...simplePosts]);
      setNewPostContent('');
      setSelectedImages([]);
      setSelectedVideo(null);
    }
  };

  // Handle image upload for centered layout
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    
    // Simulate upload - in production, you would upload to a server
    setTimeout(() => {
      const uploadedImages: string[] = [];
      for (let i = 0; i < Math.min(files.length, 4); i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            uploadedImages.push(e.target.result as string);
            if (uploadedImages.length === Math.min(files.length, 4)) {
              setSelectedImages(prev => [...prev, ...uploadedImages]);
              setUploading(false);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }, 1000);
  };

  // Handle video upload for centered layout
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file) return;
    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedVideo(e.target.result as string);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }, 1000);
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

  // Handle comment for centered layout
  const handleCommentSubmit = (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    // For centered layout: update simplePosts with new comment
    setSimplePosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
    
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Handle comment for GraphQL posts
  const handleGraphQLCommentSubmit = async (postId: string) => {
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

  // Handle repost for centered layout
  const handleSimpleRepost = (postId: string) => {
    setSimplePosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, retweets: post.retweets + 1 }
          : post
      )
    );
  };

  // Handle repost for GraphQL posts
  const handleGraphQLRepost = async (postId: string) => {
    try {
      const result = await repost({ 
        variables: { 
          postId,
          comment: null
        } 
      });
      
      console.log('Repost successful:', result);
      
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

  // Handle like for centered layout
  const handleSimpleLike = (postId: string) => {
    setSimplePosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  // Handle share for centered layout
  const handleSimpleShare = async (postId: string) => {
    const post = simplePosts.find(p => p.id === postId);
    if (!post) return;

    const shareUrl = `${window.location.origin}/post/${postId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this post',
          text: post.content,
          url: shareUrl,
        });
      } catch (shareError: any) {
        if (shareError.name !== 'AbortError') {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        }
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  // Handle share for GraphQL posts
  const handleGraphQLShare = async (postId: string) => {
    try {
      const result = await sharePost({ 
        variables: { 
          postId, 
          platform: 'web', 
          message: 'Check out this post!' 
        } 
      });

      if (result.data?.sharePost?.success) {
        const shareUrl = result.data.sharePost.shareUrl || 
                         `${window.location.origin}/post/${postId}`;
        
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Check out this post',
              text: result.data.sharePost.message || 'Check out this post!',
              url: shareUrl,
            });
          } catch (shareError: any) {
            if (shareError.name !== 'AbortError') {
              await navigator.clipboard.writeText(shareUrl);
              alert('Link copied to clipboard!');
            }
          }
        } else {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        }
      } else {
        alert('Share failed: ' + (result.data?.sharePost?.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Share failed:', error);
      alert(`Share failed: ${error.message}`);
    }
  };

  // Handle save
  const handleSave = async (postId: string) => {
    console.log('Save post:', postId);
  };

  // Handle profile edit navigation
  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    navigate('/profile/edit');
  };

  // Handle create post via GraphQL
  const handleGraphQLCreatePost = async () => {
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
  if (loading) return <div className="loading-screen">Loading...</div>;

  // Render single header component
  const renderHeader = () => (
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
        )}
      </div>
    </div>
  );
  
  // Show centered layout when GraphQL fails or returns no posts
  if (error || posts.length === 0) {
    return (
      <>
        {renderHeader()}
        <div className="homepage-centered" style={{ paddingTop: '80px' }}>
        {/* Create Post Card - Centered */}
        <div className="create-post-centered">
          <div className="user-avatar">
            <img 
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'} 
              alt="User" 
            />
          </div>
          <div className="post-input-container">
            <textarea 
              placeholder="What's happening?"
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="post-actions">
              <div className="media-options">
                <button 
                  className="media-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="fas fa-image"></i> Photo/Video
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <button 
                  className="media-btn"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <i className="fas fa-video"></i> Video
                </button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ display: 'none' }}
                />
                <button className="media-btn">
                  <i className="fas fa-poll"></i> Poll
                </button>
                <button className="media-btn">
                  <i className="fas fa-smile"></i> Emoji
                </button>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="post-submit-btn secondary"
                  onClick={handleGraphQLCreatePost}
                  disabled={uploading}
                >
                  {uploading ? 'Posting...' : 'Post via GraphQL'}
                </button>
                <button 
                  className="post-submit-btn"
                  onClick={handleNewPost}
                  disabled={uploading}
                >
                  {uploading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Show selected media */}
        {selectedImages.length > 0 && (
          <div className="selected-media">
            <h4>Selected Images:</h4>
            <div className="selected-images">
              {selectedImages.map((img: string, index: number) => (
                <div key={index} className="image-preview">
                  <img src={img} alt="Preview" />
                  <button
                    onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                    className="remove-image-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedVideo && (
          <div className="selected-video">
            <h4>Selected Video:</h4>
            <div className="video-preview">
              <video src={selectedVideo} controls style={{ maxWidth: '100%', borderRadius: '8px' }} />
              <button
                onClick={() => setSelectedVideo(null)}
                className="remove-video-btn"
              >
                Remove Video
              </button>
            </div>
          </div>
        )}
        
        {/* Generate Sample Posts Button */}
        <div style={{ margin: '20px 0', textAlign: 'center' }}>
          <button 
            onClick={handleGenerateSamplePosts}
            className="generate-posts-btn"
            disabled={loadingLocalPosts}
          >
            {loadingLocalPosts ? 'Loading...' : 'Generate Sample Posts'}
          </button>
        </div>
        
        {/* Posts Feed - Centered */}
        <div className="posts-feed-centered">
          {simplePosts.map((post: SimplePost) => (
            <div key={post.id} className="post-card-centered">
              <div className="post-header">
                <img src={post.userAvatar} alt={post.username} />
                <div className="post-user-info">
                  <strong>{post.username}</strong>
                  <span>@{post.handle} · {post.time}</span>
                </div>
                <button 
                  className="delete-post-btn"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              <div className="post-content">
                <p>{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <div className="post-images">
                    {post.images.map((img: string, index: number) => (
                      <img key={index} src={img} alt="Post media" className="post-media" />
                    ))}
                  </div>
                )}
                {post.video && (
                  <div className="post-video">
                    <video src={post.video} controls style={{ width: '100%', borderRadius: '8px' }} />
                  </div>
                )}
              </div>
              
              <div className="post-engagement">
                <button 
                  className="engagement-btn"
                  onClick={() => handleCommentSubmit(post.id)}
                >
                  <i className="far fa-comment"></i> {post.comments}
                </button>
                <button 
                  className="engagement-btn"
                  onClick={() => handleSimpleRepost(post.id)}
                >
                  <i className="fas fa-retweet"></i> {post.retweets}
                </button>
                <button 
                  className="engagement-btn"
                  onClick={() => handleSimpleLike(post.id)}
                >
                  <i className="far fa-heart"></i> {post.likes}
                </button>
                <button 
                  className="engagement-btn"
                  onClick={() => handleSimpleShare(post.id)}
                >
                  <i className="far fa-share-square"></i>
                </button>
              </div>

              {/* Comment Input */}
              <div className="comment-input-section">
                <input
                  type="text"
                  placeholder="Add a comment..."
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
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Also show original CreatePost component for fallback */}
        <div className="original-create-post">
          <CreatePost onPostCreated={handlePostCreated} />
          
          {localPosts.length > 0 && (
            <div className="local-posts">
              <h3>Local Posts</h3>
              {localPosts.map((post) => (
                <PostComponent 
                  key={post.id} 
                  post={post}
                  onLike={() => handleSimpleLike(post.id)}
                  onComment={() => console.log('Comment on post:', post.id)}
                  onRepost={() => handleSimpleRepost(post.id)}
                  onShare={() => handleSimpleShare(post.id)}
                  onSave={() => handleSave(post.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      </>
    );
  }

  // Original layout when GraphQL works
  return (
    <>
      {renderHeader()}
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
            
            {/* Edit Profile Button */}
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
        {/* CreatePost component */}
        <div style={{ marginBottom: '20px' }}>
          <CreatePost onPostCreated={handlePostCreated} />
        </div>

        {/* Display GraphQL Posts */}
        <div>
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
              
              {/* Post Stats */}
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
              
              {/* PostActions Component */}
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
                  onComment={() => handleGraphQLCommentSubmit(post.id)}
                  onRepost={() => handleGraphQLRepost(post.id)}
                  onShare={() => handleGraphQLShare(post.id)}
                  onSave={() => handleSave(post.id)}
                />
              </div>

              {/* Post Analytics */}
              {user?.id === post.author.id && (
                <div style={{ marginTop: '15px' }}>
                  <PostAnalytics 
                    postId={post.id}
                    isOwner={true}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Trending */}
      <div style={{ width: '300px', flexShrink: 0 }}>
        <TrendingSidebar />
      </div>
    </div>
    </>
  );
};

export default HomePage;