import { useState, useEffect } from 'react';

// Define your mock data properly
const mockPosts = [
  {
    id: '1',
    content: 'Just launched my new project! 🚀 So excited to share this with everyone. What do you think?',
    images: ['https://picsum.photos/seed/post1/800/600'],
    author: {
      id: 'user2',
      name: 'Sarah Johnson',
      username: 'sarahj',
      email: 'sarah.johnson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      verified: true,
      createdAt: '2024-01-15T10:30:00Z',
    },
    likes: 245,
    comments: 42,
    shares: 18,
    createdAt: '2024-02-01T10:30:00Z',
    isLiked: true,
    isSaved: false,
  },
  {
    id: '2',
    content: 'Beautiful sunset today! Nature never fails to amaze me 🌅 #photography #nature',
    images: ['https://picsum.photos/seed/sunset/800/600'],
    author: {
      id: 'user3',
      name: 'Mike Chen',
      username: 'mikechen',
      email: 'mike.chen@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      verified: false,
      createdAt: '2024-01-20T14:45:00Z',
    },
    likes: 189,
    comments: 23,
    shares: 9,
    createdAt: '2024-01-31T18:45:00Z',
    isLiked: false,
    isSaved: true,
  },
  {
    id: '3',
    content: 'Working on an amazing new feature for our app! Stay tuned for updates. Who else is coding on a Friday night? 💻',
    author: {
      id: 'user4',
      name: 'Alex Rivera',
      username: 'alexrivera',
      email: 'alex.rivera@example.com',
      avatar: 'https://i.pravatar.cc/150?img=4',
      verified: true,
      createdAt: '2024-01-25T09:15:00Z',
    },
    likes: 312,
    comments: 56,
    shares: 24,
    createdAt: '2024-01-30T22:15:00Z',
    isLiked: true,
    isSaved: false,
  },
  {
    id: '4',
    content: 'Coffee + Code = Perfect Morning ☕️👨‍💻\n\nWhat\'s your favorite coding setup?',
    images: [
      'https://picsum.photos/seed/coffee1/800/600',
      'https://picsum.photos/seed/coffee2/800/600',
    ],
    author: {
      id: 'user5',
      name: 'Emma Watson',
      username: 'emmaw',
      email: 'emma.watson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
      verified: false,
      createdAt: '2024-02-01T11:20:00Z',
    },
    likes: 167,
    comments: 38,
    shares: 12,
    createdAt: '2024-01-29T08:30:00Z',
    isLiked: false,
    isSaved: false,
  },
  {
    id: '5',
    content: 'Just hit 10k followers! 🎉 Thank you all for the amazing support. This community is incredible! 💙',
    author: {
      id: 'user6',
      name: 'David Kim',
      username: 'davidkim',
      email: 'david.kim@example.com',
      avatar: 'https://i.pravatar.cc/150?img=6',
      verified: true,
      createdAt: '2024-02-05T16:30:00Z',
    },
    likes: 421,
    comments: 89,
    shares: 47,
    createdAt: '2024-01-28T12:00:00Z',
    isLiked: false,
    isSaved: true,
  },
];

export const useFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: null,
  });

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set the mock posts
        console.log('Loading mock posts:', mockPosts.length);
        setPosts(mockPosts);
        
        setPageInfo({
          hasNextPage: false,
          endCursor: null,
        });
      } catch (err) {
        console.error('Error loading feed:', err);
        setError('Failed to load feed');
        // Even on error, set some mock data
        setPosts(mockPosts.slice(0, 2));
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const fetchMore = async () => {
    console.log('Fetch more called');
    // For now, just return a resolved promise
    return Promise.resolve();
  };

  const refetch = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(mockPosts);
    } catch (err) {
      setError('Failed to refresh feed');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  };

  const handleComment = async (postId: string, content: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );
  };

  const handleShare = async (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, shares: post.shares + 1 }
          : post
      )
    );
  };

  const handleSave = async (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
  };

  return {
    posts,
    loading,
    error,
    fetchMore,
    refetch,
    pageInfo,
    handleLike,
    handleComment,
    handleShare,
    handleSave,
  };
};