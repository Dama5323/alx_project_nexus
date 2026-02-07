// server.js - CORRECTED VERSION
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

// Debug log to check env vars
console.log('=== ENVIRONMENT VARIABLES LOADED ===');
console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Cloudinary API Key present:', !!process.env.CLOUDINARY_API_KEY);
console.log('Cloudinary API Secret present:', !!process.env.CLOUDINARY_API_SECRET);
console.log('====================================');

const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Detect if running on Vercel
const isVercel = process.env.VERCEL === '1';

// ===== SIMPLE USER TRACKING =====
let currentUserData = {
  id: 'current-user',
  name: 'Damaris Chege', 
  username: 'deenyashke', 
  email: 'damaris@example.com',
  avatar: 'https://res.cloudinary.com/dzyqof9it/image/upload/v1770419352/ava_ivuuzq.webp',
  bio: 'Software developer from Kenya',
  website: 'dama5323.github.io/DamaChege_Portfolio/',
  location: 'Nairobi, Kenya',
  followers: 100,
  following: 50,
  postsCount: 10,
  verified: true,
  createdAt: '2024-01-01T00:00:00Z',
  isFollowing: false,
  isBlocked: false
};

// Add mock notifications array
let mockNotifications = [];

// ===== 1. EXPRESS SETUP =====
const app = express();

// Update CORS for production
const allowedOrigins = isVercel 
  ? [
      'https://socialfeed.vercel.app',
      'https://socialfeed-*.vercel.app',
      'https://*.vercel.app',
      'http://localhost:3000'
    ]
  : ['http://localhost:3000'];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'File too large' });
  }
  next(err);
});

// Handle preflight requests
app.options('*', cors());

// ===== 2. CLOUDINARY SETUP =====
console.log('Configuring Cloudinary...');
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzyqof9it',
    api_key: process.env.CLOUDINARY_API_KEY || '244583525438392',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'En4HcWjzykTscRrO30RaJaB646U'
  });
  console.log('✅ Cloudinary configured successfully');
} catch (error) {
  console.error('❌ Cloudinary configuration failed:', error.message);
  console.log('Using mock Cloudinary configuration for testing');
}

// ===== 3. FILE UPLOAD SETUP =====
// Create uploads directory - only declare ONCE here
const uploadDir = isVercel 
  ? '/tmp/uploads' 
  : path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// File filter for upload validation
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  
  const isImage = allowedImageTypes.includes(file.mimetype);
  const isVideo = allowedVideoTypes.includes(file.mimetype);
  
  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images and videos are allowed.`), false);
  }
};

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB for images
    files: 1 // Limit to 1 file per request
  }
});

const videoUpload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (allowedVideoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid video file type. Only MP4, WebM, and OGG are allowed.'), false);
    }
  },
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB for videos
    files: 1
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// ===== 4. UPLOAD ENDPOINTS =====
// General image upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    console.log('📤 Upload endpoint hit');
    console.log('File received:', req.file);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Create URL to access the file
    const baseUrl = isVercel 
      ? `https://${req.headers.host}`
      : 'http://localhost:4000';
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    console.log('File saved at:', fileUrl);
    
    res.json({ 
      success: true,
      url: fileUrl,
      optimizedUrl: fileUrl,
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message
    });
  }
});

// Profile image upload endpoint
app.post('/api/avatar/upload', upload.single('avatar'), (req, res) => {
  try {
    console.log('📤 Avatar upload endpoint hit');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Validate it's an image
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only image files are allowed for avatars' });
    }
    
    // Create URL to access the file
    const baseUrl = isVercel 
      ? `https://${req.headers.host}`
      : 'http://localhost:4000';
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    console.log('✅ Avatar saved at:', fileUrl);
    
    // Update the current user's avatar
    currentUserData.avatar = fileUrl;
    
    // Update avatar in all posts
    mockPosts.forEach(post => {
      if (post.author.id === 'current-user') {
        post.author.avatar = fileUrl;
      }
      post.comments.forEach(comment => {
        if (comment.author.id === 'current-user') {
          comment.author.avatar = fileUrl;
        }
      });
    });
    
    res.json({ 
      success: true,
      url: fileUrl,
      message: 'Avatar updated successfully',
      user: currentUserData
    });
    
  } catch (error) {
    console.error('❌ Avatar upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload avatar',
      details: error.message
    });
  }
});

// Video upload endpoint
app.post('/api/upload/video', videoUpload.single('video'), (req, res) => {
  try {
    console.log('🎥 Video upload endpoint hit');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video uploaded' });
    }
    
    const baseUrl = isVercel 
      ? `https://${req.headers.host}`
      : 'http://localhost:4000';
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    console.log('✅ Video saved at:', fileUrl);
    
    res.json({ 
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
  } catch (error) {
    console.error('❌ Video upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload video',
      details: error.message
    });
  }
});

// ===== 5. AUTHENTICATION HELPER =====
const getUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    // For testing, return the current user data
    return currentUserData;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
};

// ===== 6. TYPE DEFINITIONS =====
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    email: String
    avatar: String
    bio: String
    website: String
    location: String
    followers: Int!
    following: Int!
    postsCount: Int!
    verified: Boolean!
    createdAt: String!
    isFollowing: Boolean!
    isBlocked: Boolean!
  }

  type Post {
    id: ID!
    content: String!
    images: [String!]
    video: String
    author: User!
    likes: Int!
    comments: [Comment!]!
    shares: Int!
    reposts: Int!
    views: Int!
    createdAt: String!
    updatedAt: String
    isLiked: Boolean!
    isReposted: Boolean!
    isSaved: Boolean!
  }

  type Comment {
    id: ID!
    postId: ID!
    content: String!
    author: User!
    likes: Int!
    createdAt: String!
    updatedAt: String
    isLiked: Boolean!
  }

  type Reaction {
    id: ID!
    type: String!
    user: User!
    createdAt: String!
  }

  type FeedEdge {
    cursor: String!
    node: Post!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type FeedConnection {
    edges: [FeedEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type PostConnection {
    edges: [FeedEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type MutationResponse {
    success: Boolean!
    message: String
  }

  input FeedFilter {
    type: String
    userId: ID
  }
  
  type ShareResponse {
    success: Boolean!
    message: String
    postId: ID
    shareUrl: String
    platform: String
  }

  type FollowStatus {
    isFollowing: Boolean!
    isFollowedBy: Boolean!
  }

  type Notification {
    id: ID!
    type: String!
    message: String!
    userId: ID!
    senderId: ID!
    isRead: Boolean!
    createdAt: String!
  }

  type Analytics {
    totalPosts: Int!
    totalLikes: Int!
    totalComments: Int!
    totalShares: Int!
    totalViews: Int!
    followerGrowth: Float!
    engagementRate: Float!
    topPosts: [TopPost!]!
    peakTimes: [String!]!
  }

  type TopPost {
    id: ID!
    content: String!
    likes: Int!
    comments: Int!
    views: Int!
  }

  type HashtagStats {
    postCount: Int!
    trendScore: Int!
    growth: Float!
  }

  input UpdateProfileInput {
    name: String
    username: String
    bio: String
    website: String
    location: String
    avatar: String
  }

  type Query {
    feed(first: Int!, after: String, filter: FeedFilter): FeedConnection!
    user(username: String!): User
    userPosts(userId: ID!, first: Int!, after: String): PostConnection
    followStatus(userId: ID!): FollowStatus
    userAnalytics(userId: ID!, timeRange: String!): Analytics
    userNotifications(userId: ID!): [Notification!]!
    hashtagPosts(hashtag: String!, sortBy: String!): [Post!]!
    hashtagStats(hashtag: String!): HashtagStats
    trendingHashtags(limit: Int!): [String!]!
  }

  type Mutation {
    # Post mutations
    createPost(content: String!, images: [String!]): Post!
    deletePost(postId: ID!): MutationResponse!
    
    # Like/Unlike
    likePost(postId: ID!): Post!
    unlikePost(postId: ID!): Post!
    
    # Save/Unsave
    savePost(postId: ID!): Post!
    unsavePost(postId: ID!): Post!
    
    # Comments
    addComment(postId: ID!, content: String!): Comment!
    deleteComment(commentId: ID!): MutationResponse!
    likeComment(commentId: ID!): Comment!
    
    # Reactions (advanced)
    addReaction(postId: ID!, type: String!): Reaction!
    removeReaction(postId: ID!): MutationResponse!

    # Reposts
    repost(postId: ID!, comment: String): Post!
    deleteRepost(postId: ID!): MutationResponse!

    # Shares
    sharePost(postId: ID!, platform: String, message: String): ShareResponse!

    # Profile mutations
    updateProfile(input: UpdateProfileInput!): User!
    followUser(userId: ID!): User!
    unfollowUser(userId: ID!): User!

    # Notifications
    markNotificationAsRead(notificationId: ID!): Notification!
    markAllNotificationsAsRead(userId: ID!): MutationResponse!
  }
`;

// ===== 7. COMPLETE MOCK DATA =====
let mockPosts = [
  {
    id: '1',
    content: 'Just launched my new project! 🚀 #WebDevelopment #ReactJS',
    images: ['https://res.cloudinary.com/dzyqof9it/image/upload/v1758369967/architecture_diagrams/fl47pqr9swm3bwoysshx.jpg'],
    video: null,
    author: {
      id: 'user2',
      name: 'Gillian Shih',
      username: 'gillian',
      email: 'gillian.shih@example.com',
      avatar: 'https://res.cloudinary.com/dzyqof9it/image/upload/v1770419352/ava_ivuuzq.webp',
      bio: 'Software Developer',
      website: 'https://shi.dev',
      location: 'Nakuru, Kenya',
      followers: 1250,
      following: 340,
      postsCount: 42,
      verified: true,
      createdAt: '2024-01-15T10:30:00Z',
      isFollowing: false,
      isBlocked: false
    },
    likes: 245,
    comments: [
      {
        id: 'comment1',
        postId: '1',
        content: 'Amazing work! 👏',
        author: {
          id: 'user3',
          name: 'Mike Chege',
          username: 'mikechen',
          email: 'mike@example.com',
          avatar: 'https://i.pravatar.cc/150?img=3',
          bio: 'Developer at Tech Corp',
          website: 'https://mikechen.dev',
          location: 'San Francisco, CA',
          followers: 500,
          following: 200,
          postsCount: 15,
          verified: false,
          createdAt: '2024-01-20T00:00:00Z',
          isFollowing: false,
          isBlocked: false
        },
        likes: 12,
        createdAt: '2024-02-01T11:30:00Z',
        updatedAt: null,
        isLiked: false
      }
    ],
    shares: 18,
    reposts: 5,
    views: 1200,
    createdAt: '2024-02-01T10:30:00Z',
    updatedAt: null,
    isLiked: true,
    isReposted: false,
    isSaved: false,
  },
  {
    id: '2',
    content: 'Working on something exciting! Stay tuned. #AI #Tech',
    images: [],
    video: null,
    author: currentUserData,
    likes: 45,
    comments: [],
    shares: 3,
    reposts: 1,
    views: 300,
    createdAt: '2024-02-02T09:15:00Z',
    updatedAt: null,
    isLiked: false,
    isReposted: false,
    isSaved: false,
  }
];

let commentId = 2;

// ===== 8. RESOLVERS =====
const resolvers = {
  Query: {
    feed: (_, { first = 10, after, filter }) => {
      const edges = mockPosts.slice(0, first).map((post, index) => ({
        cursor: `cursor${index}`,
        node: post,
      }));
      
      return {
        edges,
        pageInfo: {
          hasNextPage: mockPosts.length > first,
          hasPreviousPage: false,
          startCursor: edges[0]?.cursor || null,
          endCursor: edges[edges.length - 1]?.cursor || null,
        },
        totalCount: mockPosts.length,
      };
    },

    user: (_, { username }) => {
      // Check if this is the current user
      if (username === 'deenyashke' || username === 'currentuser') {
        return currentUserData;
      }
      
      // Return other mock users
      const mockUser = {
        id: 'user123',
        name: 'John Doe',
        username: username,
        email: 'john@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: 'Software developer passionate about building great products.',
        website: 'https://johndoe.dev',
        location: 'San Francisco, CA',
        followers: 1250,
        following: 340,
        postsCount: 42,
        verified: true,
        createdAt: '2024-01-15T10:30:00Z',
        isFollowing: false,
        isBlocked: false
      };
      return mockUser;
    },
    
    userPosts: (_, { userId, first }) => {
      const userPosts = mockPosts.filter(post => post.author.id === userId);
      const edges = userPosts.slice(0, first).map((post, index) => ({
        cursor: `cursor${index}`,
        node: post,
      }));
      
      return {
        edges,
        pageInfo: {
          hasNextPage: userPosts.length > first,
          endCursor: edges[edges.length - 1]?.cursor || null,
        },
        totalCount: userPosts.length,
      };
    },
    
    followStatus: (_, { userId }) => {
      return {
        isFollowing: false,
        isFollowedBy: false
      };
    },

    userAnalytics: (_, { userId, timeRange }) => {
      return {
        totalPosts: 42,
        totalLikes: 1250,
        totalComments: 340,
        totalShares: 180,
        totalViews: 5600,
        followerGrowth: 12.5,
        engagementRate: 4.2,
        topPosts: [
          {
            id: '1',
            content: 'Just launched my new project! 🚀',
            likes: 245,
            comments: 18,
            views: 1200
          },
          {
            id: '2',
            content: 'Working on something exciting!',
            likes: 45,
            comments: 3,
            views: 300
          }
        ],
        peakTimes: ['10:00 AM', '2:00 PM', '8:00 PM']
      };
    },

    userNotifications: (_, { userId }) => {
      return mockNotifications.filter(n => n.userId === userId);
    },

    hashtagPosts: (_, { hashtag, sortBy }) => {
      const hashtagPosts = mockPosts.filter(post => 
        post.content.toLowerCase().includes(`#${hashtag.toLowerCase()}`)
      );
      
      if (sortBy === 'popular') {
        return hashtagPosts.sort((a, b) => b.likes - a.likes);
      } else {
        return hashtagPosts;
      }
    },

    hashtagStats: (_, { hashtag }) => {
      const postsWithHashtag = mockPosts.filter(post => 
        post.content.toLowerCase().includes(`#${hashtag.toLowerCase()}`)
      ).length;
      
      return {
        postCount: postsWithHashtag,
        trendScore: postsWithHashtag * 10,
        growth: postsWithHashtag > 5 ? 25.5 : 5.2
      };
    },

    trendingHashtags: (_, { limit }) => {
      const allHashtags = mockPosts.flatMap(post => {
        const matches = post.content.match(/#\w+/g) || [];
        return matches.map(tag => tag.substring(1).toLowerCase());
      });
      
      const hashtagCounts = {};
      allHashtags.forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
      
      return Object.entries(hashtagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([tag]) => tag);
    }
  },
  
  Mutation: {
    createPost: (_, { content, images }, context) => {
      console.log('Creating post with context:', context);
      const user = currentUserData; // Always use currentUserData for now
      
      const newPost = {
        id: `post${mockPosts.length + 1}`,
        content,
        images: images || [],
        video: null,
        author: user,
        likes: 0,
        comments: [],
        shares: 0,
        reposts: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        isLiked: false,
        isReposted: false,
        isSaved: false,
      };
      mockPosts.unshift(newPost);
      return newPost;
    },
    
    deletePost: (_, { postId }) => {
      const postIndex = mockPosts.findIndex(p => p.id === postId);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      mockPosts.splice(postIndex, 1);
      return { success: true, message: 'Post deleted successfully' };
    },
    
    likePost: (_, { postId }, context) => {
      const post = mockPosts.find(p => p.id === postId);
      if (post) {
        const user = currentUserData;
        
        post.likes += 1;
        post.isLiked = true;
        
        if (post.author.id !== user.id) {
          const likeNotification = {
            id: `notification-${Date.now()}`,
            type: 'like',
            message: `${user.name} liked your post`,
            userId: post.author.id,
            senderId: user.id,
            isRead: false,
            createdAt: new Date().toISOString()
          };
          mockNotifications.push(likeNotification);
        }
        
        return post;
      }
      throw new Error('Post not found');
    },
    
    unlikePost: (_, { postId }) => {
      const post = mockPosts.find(p => p.id === postId);
      if (post) {
        post.likes = Math.max(0, post.likes - 1);
        post.isLiked = false;
        return post;
      }
      throw new Error('Post not found');
    },
    
    addComment: (_, { postId, content }, context) => {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      const user = currentUserData;
      
      const newComment = {
        id: `comment${commentId++}`,
        postId,
        content,
        author: user,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        isLiked: false,
      };
      
      post.comments.push(newComment);
      
      if (post.author.id !== user.id) {
        const commentNotification = {
          id: `notification-${Date.now()}`,
          type: 'comment',
          message: `${user.name} commented on your post`,
          userId: post.author.id,
          senderId: user.id,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        mockNotifications.push(commentNotification);
      }
      
      return newComment;
    },
    
    deleteComment: (_, { commentId }) => {
      for (const post of mockPosts) {
        const commentIndex = post.comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
          post.comments.splice(commentIndex, 1);
          return { success: true, message: 'Comment deleted successfully' };
        }
      }
      throw new Error('Comment not found');
    },
    
    likeComment: (_, { commentId }) => {
      for (const post of mockPosts) {
        const comment = post.comments.find(c => c.id === commentId);
        if (comment) {
          comment.likes += 1;
          comment.isLiked = true;
          
          if (comment.author.id !== currentUserData.id) {
            const likeNotification = {
              id: `notification-${Date.now()}`,
              type: 'like',
              message: `${currentUserData.name} liked your comment`,
              userId: comment.author.id,
              senderId: currentUserData.id,
              isRead: false,
              createdAt: new Date().toISOString()
            };
            mockNotifications.push(likeNotification);
          }
          
          return comment;
        }
      }
      throw new Error('Comment not found');
    },
    
    savePost: (_, { postId }) => {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      post.isSaved = true;
      return post;
    },
    
    unsavePost: (_, { postId }) => {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      post.isSaved = false;
      return post;
    },

    repost: (_, { postId, comment }) => {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');

      if (!post.isReposted) {
        post.reposts += 1;
        post.isReposted = true;
        
        if (post.author.id !== currentUserData.id) {
          const repostNotification = {
            id: `notification-${Date.now()}`,
            type: 'repost',
            message: `${currentUserData.name} reposted your post`,
            userId: post.author.id,
            senderId: currentUserData.id,
            isRead: false,
            createdAt: new Date().toISOString()
          };
          mockNotifications.push(repostNotification);
        }
      }

      return post;
    },

    deleteRepost: (_, { postId }) => {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');

      post.reposts = Math.max(0, post.reposts - 1);
      post.isReposted = false;

      return { success: true, message: 'Repost removed' };
    },

    sharePost: (_, args) => {
      const { postId, platform, message } = args;
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');

      post.shares += 1;

      const shareUrl = `https://yourdomain.com/post/${postId}`;
      
      console.log(`Post ${postId} shared${platform ? ' on ' + platform : ''}${message ? ' with message: ' + message : ''}`);

      return {
        success: true,
        message: 'Post shared successfully',
        postId,
        shareUrl,
        platform: platform || 'web'
      };
    },

    addReaction: (_, { postId, type }) => {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      if (type === 'LIKE') {
        post.likes += 1;
        post.isLiked = true;
      }
      
      return {
        id: `reaction${Date.now()}`,
        type,
        user: currentUserData,
        createdAt: new Date().toISOString(),
      };
    },

    removeReaction: (_, { postId }) => {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      post.likes = Math.max(0, post.likes - 1);
      post.isLiked = false;
      
      return { success: true, message: 'Reaction removed' };
    },

    updateProfile: (_, { input }, context) => {
      console.log('Update profile called with input:', input);
      
      // Update the current user data
      currentUserData = {
        ...currentUserData,
        name: input.name || currentUserData.name,
        username: input.username || currentUserData.username,
        avatar: input.avatar || currentUserData.avatar,
        bio: input.bio || currentUserData.bio,
        website: input.website || currentUserData.website,
        location: input.location || currentUserData.location
      };
      
      // Update the author in existing posts
      mockPosts.forEach(post => {
        if (post.author.id === 'current-user') {
          post.author = currentUserData;
        }
      });
      
      // Update comments
      mockPosts.forEach(post => {
        post.comments.forEach(comment => {
          if (comment.author.id === 'current-user') {
            comment.author = currentUserData;
          }
        });
      });
      
      console.log('Updated user data:', currentUserData);
      return currentUserData;
    },
    
    followUser: (_, { userId }) => {
      const followNotification = {
        id: `notification-${Date.now()}`,
        type: 'follow',
        message: `${currentUserData.name} started following you`,
        userId: userId,
        senderId: currentUserData.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      mockNotifications.push(followNotification);
      
      return {
        id: userId,
        name: 'Test User',
        username: 'testuser',
        followers: 1251,
        following: 340,
        postsCount: 42,
        isFollowing: true
      };
    },
    
    unfollowUser: (_, { userId }) => {
      return {
        id: userId,
        name: 'Test User',
        username: 'testuser',
        followers: 1250,
        following: 340,
        postsCount: 42,
        isFollowing: false
      };
    },

    markNotificationAsRead: (_, { notificationId }) => {
      const notification = mockNotifications.find(n => n.id === notificationId);
      if (!notification) throw new Error('Notification not found');
      
      notification.isRead = true;
      return notification;
    },

    markAllNotificationsAsRead: (_, { userId }) => {
      mockNotifications.forEach(notification => {
        if (notification.userId === userId) {
          notification.isRead = true;
        }
      });
      
      return { success: true, message: 'All notifications marked as read' };
    }
  }
};

// ===== 9. CREATE APOLLO SERVER =====
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Get token from headers
      const token = req.headers.authorization || '';
      
      // Extract actual token (remove 'Bearer ' prefix if present)
      const authToken = token.replace('Bearer ', '');
      
      // Get user from token
      const user = getUserFromToken(authToken);
      
      return { 
        token: authToken,
        user: user || currentUserData
      };
    },
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
        extensions: {
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
        }
      };
    }
  });

  await server.start();
  
  server.applyMiddleware({ 
    app,
    cors: false // Disable Apollo CORS since Express handles it
  });

  // ===== 10. ADDITIONAL UTILITY ENDPOINTS =====
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Get all uploads endpoint
  app.get('/api/uploads', (req, res) => {
    try {
      const files = fs.readdirSync(uploadDir);
      const fileDetails = files.map(filename => {
        const filePath = path.join(uploadDir, filename);
        const stats = fs.statSync(filePath);
        const baseUrl = isVercel 
          ? `https://${req.headers.host}`
          : 'http://localhost:4000';
        return {
          filename,
          url: `${baseUrl}/uploads/${filename}`,
          size: stats.size,
          created: stats.birthtime,
          mimetype: 'auto-detected'
        };
      });
      
      res.json({ 
        success: true,
        files: fileDetails,
        total: fileDetails.length
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to list uploads',
        details: error.message
      });
    }
  });

  // Delete upload endpoint
  app.delete('/api/upload/:filename', (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadDir, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      fs.unlinkSync(filePath);
      
      res.json({ 
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to delete file',
        details: error.message
      });
    }
  });

  // Current user endpoint
  app.get('/api/current-user', (req, res) => {
    res.json({
      success: true,
      user: currentUserData
    });
  });

  // Update current user endpoint
  app.post('/api/update-profile', (req, res) => {
    try {
      const { name, username, bio, website, location, avatar } = req.body;
      
      currentUserData = {
        ...currentUserData,
        name: name || currentUserData.name,
        username: username || currentUserData.username,
        bio: bio || currentUserData.bio,
        website: website || currentUserData.website,
        location: location || currentUserData.location,
        avatar: avatar || currentUserData.avatar
      };
      
      res.json({
        success: true,
        user: currentUserData,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to update profile',
        details: error.message
      });
    }
  });

  // ===== 11. ERROR HANDLING MIDDLEWARE =====
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ 
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.url}`,
      timestamp: new Date().toISOString()
    });
  });

  // ===== 12. START SERVER =====
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`\n📊 Available endpoints:`);
    console.log(`   - GraphQL API: http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`   - Current user: http://localhost:${PORT}/api/current-user`);
    console.log(`   - Update profile: http://localhost:${PORT}/api/update-profile`);
    console.log(`   - Image upload: http://localhost:${PORT}/api/upload`);
    console.log(`   - Profile upload: http://localhost:${PORT}/api/avatar/upload`);
    console.log(`   - Video upload: http://localhost:${PORT}/api/upload/video`);
    console.log(`   - Health check: http://localhost:${PORT}/api/health`);
    console.log(`   - List uploads: http://localhost:${PORT}/api/uploads`);
    console.log(`   - Uploads served at: http://localhost:${PORT}/uploads/`);
    console.log(`\n👤 Current user:`);
    console.log(`   Name: ${currentUserData.name}`);
    console.log(`   Username: @${currentUserData.username}`);
    console.log(`   Bio: ${currentUserData.bio}`);
    console.log(`\n✅ Enhanced features available:`);
    console.log(`   - Analytics dashboard with user statistics`);
    console.log(`   - Clickable hashtags with dedicated pages`);
    console.log(`   - Follow notifications for users`);
    console.log(`   - Image/video upload with validation`);
    console.log(`   - Trending hashtags`);
    console.log(`   - Post notifications (likes, comments, reposts)`);
    console.log(`   - File type validation (images & videos)`);
    console.log(`   - Error handling middleware`);
    console.log(`   - Health check endpoint`);
    console.log(`\n📁 Upload directory: ${uploadDir}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏱️  Server started at: ${new Date().toISOString()}`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});