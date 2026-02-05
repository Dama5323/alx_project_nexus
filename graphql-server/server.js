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
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// ===== SIMPLE USER TRACKING =====
let currentUserData = {
  id: 'current-user',
  name: 'Current User',
  username: 'currentuser',
  email: 'current@example.com',
  avatar: 'https://i.pravatar.cc/150?img=1',
  bio: 'I am the current user',
  website: 'https://currentuser.dev',
  location: 'Remote',
  followers: 100,
  following: 50,
  postsCount: 10,
  verified: true,
  createdAt: '2024-01-01T00:00:00Z',
  isFollowing: false,
  isBlocked: false
};

// ===== 1. EXPRESS SETUP =====
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

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

// ===== 3. SIMPLE UPLOAD ENDPOINT (No Cloudinary for now) =====
// Create uploads directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Simple upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    console.log('📤 Upload endpoint hit');
    console.log('File received:', req.file);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Create URL to access the file
    const fileUrl = `http://localhost:4000/uploads/${req.file.filename}`;
    
    console.log('File saved at:', fileUrl);
    
    res.json({ 
      success: true,
      url: fileUrl,
      optimizedUrl: fileUrl,
      filename: req.file.filename,
      path: req.file.path
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error.message,
      stack: error.stack
    });
  }
});

// ===== 4. TYPE DEFINITIONS =====
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
  }
`;

// ===== 5. COMPLETE MOCK DATA =====
let mockPosts = [
  {
    id: '1',
    content: 'Just launched my new project! 🚀',
    images: ['https://picsum.photos/seed/post1/800/600'],
    video: null,
    author: {
      id: 'user2',
      name: 'Sarah Johnson',
      username: 'sarahj',
      email: 'sarah.johnson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bio: 'Software Developer',
      website: 'https://sarahj.dev',
      location: 'New York, NY',
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
          name: 'Mike Chen',
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
    content: 'Working on something exciting! Stay tuned.',
    images: [],
    video: null,
    author: currentUserData, // Use the tracked user data
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

// ===== 6. RESOLVERS =====
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
    }
  },
  
  Mutation: {
    createPost: (_, { content, images }) => {
      const newPost = {
        id: `post${mockPosts.length + 1}`,
        content,
        images: images || [],
        video: null,
        author: currentUserData, // Use the tracked user data
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
    
    likePost: (_, { postId }) => {
      const post = mockPosts.find(p => p.id === postId);
      if (post) {
        post.likes += 1;
        post.isLiked = true;
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
    
    addComment: (_, { postId, content }) => {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      const newComment = {
        id: `comment${commentId++}`,
        postId,
        content,
        author: currentUserData, // Use the tracked user data
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        isLiked: false,
      };
      
      post.comments.push(newComment);
      return newComment;
    },
    
    likeComment: (_, { commentId }) => {
      for (const post of mockPosts) {
        const comment = post.comments.find(c => c.id === commentId);
        if (comment) {
          comment.likes += 1;
          comment.isLiked = true;
          return comment;
        }
      }
      throw new Error('Comment not found');
    },

    repost: (_, { postId }) => {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');

      if (!post.isReposted) {
        post.reposts += 1;
        post.isReposted = true;
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
        user: currentUserData, // Use the tracked user data
        createdAt: new Date().toISOString(),
      };
    },

    updateProfile: (_, { input }) => {
      console.log('Update profile called with input:', input);
      
      // Update the tracked user data
      currentUserData = {
        ...currentUserData,
        name: input.name || currentUserData.name,
        username: input.username || currentUserData.username,
        avatar: input.avatar || currentUserData.avatar,
        bio: input.bio || '', // Return empty string instead of default
        website: input.website || currentUserData.website,
        location: input.location || currentUserData.location
      };
      
      // Update the author in existing posts
      mockPosts.forEach(post => {
        if (post.author.id === 'current-user') {
          post.author = currentUserData;
        }
      });
      
      console.log('Updated user data:', currentUserData);
      return currentUserData;
    },
    
    followUser: (_, { userId }) => {
      return {
        id: userId,
        followers: 1251,
        following: 340,
        postsCount: 42,
        isFollowing: true
      };
    },
    
    unfollowUser: (_, { userId }) => {
      return {
        id: userId,
        followers: 1250,
        following: 340,
        postsCount: 42,
        isFollowing: false
      };
    }
  }
};

// ===== 7. CREATE APOLLO SERVER =====
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      return { token };
    }
  });

  await server.start();
  
  server.applyMiddleware({ 
    app,
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true,
    }
  });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`📤 Upload endpoint at http://localhost:${PORT}/api/upload`);
    console.log(`📁 Uploads served at http://localhost:${PORT}/uploads/`);
    console.log(`✅ Profile features are now available:`);
    console.log(`   - User profile queries`);
    console.log(`   - Edit profile mutations`);
    console.log(`   - Follow/Unfollow system`);
    console.log(`   - User posts feed`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
});