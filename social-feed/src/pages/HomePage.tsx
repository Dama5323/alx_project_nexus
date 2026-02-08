// src/pages/HomePage.tsx
import { useQuery, useMutation } from '@apollo/client';
import { GET_FEED } from '../graphql/queries/feedQueries';
import { CREATE_POST } from '../graphql/mutations/postMutations';
import { LIKE_POST, UNLIKE_POST } from '../graphql/mutations/reactionMutations';
import { ADD_COMMENT } from '../graphql/mutations/commentMutations';
import { REPOST } from '../graphql/mutations/repostMutations';
import { SHARE_POST } from '../graphql/mutations/shareMutations';
import { useState, useMemo, useEffect } from 'react';
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

  // Handle post created from CreatePost component
  const handlePostCreated = (newPostData: any) => {
    const newPost: SimplePost = {
      id: Date.now().toString(),
      userAvatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      username: user?.name || 'Current User',
      handle: user?.username || 'currentuser',
      time: 'just now',
      content: newPostData.content || '',
      images: newPostData.images || [],
      video: newPostData.video || undefined,
      comments: 0,
      retweets: 0,
      likes: 0
    };
    
    setSimplePosts([newPost, ...simplePosts]);
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _handleGraphQLCreatePost = async () => {
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
    <div className="fixed-header">
      <h1>Home</h1>
      <div className="header-actions">
        {uploading && (
          <div className="uploading-indicator">
            <span>⏳</span>
            Uploading...
          </div>
        )}
        <NotificationBell />
        {user && (
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        )}
      </div>
    </div>
  );

  // Render posts with delete, like, share, repost functionality
  const renderPosts = () => (
    <div className="posts-feed-centered">
      {simplePosts.map((post: SimplePost) => (
        <div key={post.id} className="post-card-centered">
          <div className="post-header">
            <img src={post.userAvatar} alt={post.username} />
            <div className="post-user-info">
              <strong>{post.username}</strong>
              <span>@{post.handle} · {post.time}</span>
            </div>
            {/* Delete button - only show for current user's posts */}
            {(user?.username === post.handle.replace('@', '') || !user) && (
              <button 
                className="delete-post-btn"
                onClick={() => handleDeletePost(post.id)}
                title="Delete post"
              >
                <i className="fas fa-trash"></i>
              </button>
            )}
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
                <video src={post.video} controls />
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
              title="Repost"
            >
              <i className="fas fa-retweet"></i> {post.retweets}
            </button>
            <button 
              className="engagement-btn"
              onClick={() => handleSimpleLike(post.id)}
              title="Like"
            >
              <i className="far fa-heart"></i> {post.likes}
            </button>
            <button 
              className="engagement-btn"
              onClick={() => handleSimpleShare(post.id)}
              title="Share"
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
  );
  
  // Show centered layout when GraphQL fails or returns no posts
  if (error || posts.length === 0) {
    return (
      <>
        {renderHeader()}
        <div className="homepage-centered" style={{ paddingTop: '80px' }}>
          {/* Custom Create Post Section with Image/Video Upload */}
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
                className="post-textarea"
              />
              
              {/* Selected Media Preview */}
              {selectedImages.length > 0 && (
                <div className="selected-media-preview">
                  {selectedImages.map((img, index) => (
                    <div key={index} className="media-preview-item">
                      <img src={img} alt="Preview" />
                      <button 
                        onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                        className="remove-media-btn"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedVideo && (
                <div className="selected-video-preview">
                  <video src={selectedVideo} controls className="video-preview" />
                  <button 
                    onClick={() => setSelectedVideo(null)}
                    className="remove-media-btn"
                  >
                    Remove Video
                  </button>
                </div>
              )}
              
              <div className="post-actions">
                <div className="media-options">
                  {/* Image Upload */}
                  <label className="media-btn" title="Add photo">
                    <i className="fas fa-image"></i>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  
                  {/* Video Upload */}
                  <label className="media-btn" title="Add video">
                    <i className="fas fa-video"></i>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  
                  <button className="media-btn" title="Add emoji">
                    <i className="fas fa-smile"></i>
                  </button>
                </div>
                <button 
                  className="post-submit-btn"
                  onClick={handleNewPost}
                  disabled={uploading || (!newPostContent.trim() && selectedImages.length === 0 && !selectedVideo)}
                >
                  {uploading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
          
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
          
          {/* Posts Feed */}
          {renderPosts()}
          
          {/* Also show local posts */}
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
      </>
    );
  }

  // Original layout when GraphQL works
  return (
    <>
      {renderHeader()}
      <div className="homepage-layout">
        {/* Left Sidebar - User Info & Navigation */}
        <div className="left-sidebar">
          {user && (
            <div className="user-profile-card">
              <Link to={`/profile/${user.id}`} className="profile-link">
                <div className="profile-header">
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=1d9bf0&color=fff`} 
                    alt="Profile"
                    className="profile-avatar"
                  />
                  <div className="profile-info">
                    <h3>{user.name || user.email}</h3>
                    <span className="profile-handle">
                      @{user.username || user.email?.split('@')[0] || 'user'}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="profile-links">
                <Link to="/bookmarks" className="profile-link-item">
                  <span>🔖</span>
                  Bookmarks
                </Link>
                <Link to="/notifications" className="profile-link-item">
                  <span>🔔</span>
                  Notifications
                </Link>
                <Link to="/analytics" className="profile-link-item">
                  <span>📊</span>
                  Analytics
                </Link>
              </div>
              
              {/* Edit Profile Button */}
              <div className="edit-profile-section">
                <button 
                  onClick={handleEditProfile}
                  className="edit-profile-btn"
                >
                  <span>✏️</span>
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* CreatePost component */}
          <div className="create-post-container">
            <CreatePost onPostCreated={handlePostCreated} />
          </div>

          {/* Display GraphQL Posts */}
          <div className="posts-container">
            {posts.map((post: PostType) => (
              <div key={post.id} className="post-card">
                {/* Author */}
                <div className="post-author">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="author-avatar"
                  />
                  <div className="author-info">
                    <div className="author-header">
                      <div>
                        <div className="author-name">{post.author.name}</div>
                        <div className="author-handle">@{post.author.username}</div>
                      </div>
                      
                      <div className="author-actions">
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
                <div className="post-content-text">
                  {post.content.split(/(@\w+|#\w+)/).map((part, index) => {
                    if (part.match(/^@\w+/)) {
                      return (
                        <Link 
                          key={index} 
                          to={`/profile/${part.substring(1)}`}
                          className="post-mention"
                        >
                          {part}
                        </Link>
                      );
                    } else if (part.match(/^#\w+/)) {
                      return (
                        <Link 
                          key={index} 
                          to={`/hashtag/${encodeURIComponent(part.substring(1))}`}
                          className="post-hashtag"
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
                    className="post-image"
                  />
                ))}
                
                {/* Video */}
                {post.video && (
                  <video 
                    src={post.video}
                    controls
                    className="post-video-player"
                  />
                )}
                
                {/* Post Stats */}
                <div className="post-stats">
                  <span>{post.likes} Likes</span>
                  <span>{post.comments?.length || 0} Comments</span>
                  <span>{post.shares} Shares</span>
                  <span>{post.reposts || 0} Reposts</span>
                  <span>{post.views} Views</span>
                </div>
                
                {/* PostActions Component */}
                <div className="post-actions-container">
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
                  <div className="post-analytics-container">
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
        <div className="right-sidebar">
          <TrendingSidebar />
        </div>
      </div>
    </>
  );
};

export default HomePage;