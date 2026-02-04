// src/pages/HomePage.tsx - CORRECTED
import { useQuery, useMutation } from '@apollo/client';
import { GET_FEED } from '../graphql/queries/feedQueries';
import { CREATE_POST } from '../graphql/mutations/postMutations';
import { LIKE_POST, UNLIKE_POST } from '../graphql/mutations/reactionMutations';
import { ADD_COMMENT } from '../graphql/mutations/commentMutations';
import { REPOST } from '../graphql/mutations/repostMutations';
import { SHARE_POST } from '../graphql/mutations/shareMutations';
import { useState, useMemo } from 'react';
import { PostActions } from '../components/Post/PostActions';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext'; 

// Define Post type interface
interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  likes: number;
  comments: any[];
  shares: number;
  reposts: number;
  isLiked: boolean;
  isReposted: boolean;
  isSaved: boolean;
  images?: string[];
}

function HomePage() {
  const { user, logout } = useAuth();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
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
  const posts: Post[] = useMemo(() => {
    return data?.feed?.edges.map((edge: any) => edge.node) || [];
  }, [data]);

  // Handle like/unlike
  const handleLikeClick = async (postId: string) => {
    const post = posts.find((p: Post) => p.id === postId);
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

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.error('GraphQL Error:', error);
    return <div>Error loading feed. Check console.</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Add auth status bar */}
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>Hello, {user.name || user.email}</span>
            <button 
              onClick={logout}
              style={{
                padding: '5px 10px',
                background: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link 
            to="/auth"
            style={{
              padding: '5px 10px',
              background: '#1d9bf0',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Login
          </Link>
        )}
      </div>
      
      {/* Create Post Section */}
      <div style={{padding: '20px', borderBottom: '1px solid #eee'}}>
        <textarea 
          id="post-content" 
          placeholder="What's happening?" 
          style={{width: '100%', minHeight: '100px', padding: '10px', fontSize: '16px'}}
        />
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={async () => {
              const textarea = document.getElementById('post-content') as HTMLTextAreaElement;
              const content = textarea.value.trim();
              if (content) {
                try {
                  await createPost({ 
                    variables: { content, images: [] } 
                  });
                  textarea.value = '';
                } catch (err) {
                  console.error('Post creation failed:', err);
                }
              }
            }}
            style={{
              padding: '8px 24px',
              background: '#1d9bf0',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            Post
          </button>
        </div>
      </div>

      {/* Display Posts */}
      <div>
        {posts.map((post: Post) => (
          <div key={post.id} style={{
            borderBottom: '1px solid #eee',
            padding: '15px 20px'
          }}>
            {/* Author */}
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
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
              <div>
                <div style={{fontWeight: 'bold', fontSize: '15px'}}>
                  {post.author.name}
                </div>
                <div style={{color: '#536471', fontSize: '14px'}}>
                  @{post.author.username}
                </div>
              </div>
            </div>
            
            {/* Post Content */}
            <p style={{fontSize: '15px', lineHeight: '1.5', margin: '10px 0'}}>
              {post.content}
            </p>
            
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
            
            {/* Post Stats */}
            <div style={{
              marginTop: '12px',
              color: '#536471',
              fontSize: '14px',
              display: 'flex',
              gap: '20px'
            }}>
              <span>{post.likes} Likes</span>
              <span>{post.comments?.length || 0} Comments</span>
              <span>{post.shares} Shares</span>
              <span>{post.reposts || 0} Reposts</span>
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
            
            {/* Comment Input */}
            <div style={{
              marginTop: '15px',
              display: 'flex',
              gap: '8px',
              borderTop: '1px solid #eee',
              paddingTop: '12px'
            }}>
              <input
                type="text"
                data-post-id={post.id}
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
      </div>
    </div>
  );
}

export default HomePage;