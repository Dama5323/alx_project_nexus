const { ApolloServer, gql } = require('apollo-server');

// ===== 1. TYPE DEFINITIONS =====
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    email: String
    avatar: String
    bio: String
    followers: Int!
    following: Int!
    verified: Boolean!
    createdAt: String!
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

  type Query {
    feed(first: Int!, after: String, filter: FeedFilter): FeedConnection!
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
    }
`;

// ===== 2. COMPLETE MOCK DATA =====
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
      followers: 1250,
      following: 340,
      verified: true,
      createdAt: '2024-01-15T10:30:00Z',
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
          followers: 500,
          following: 200,
          verified: false,
          createdAt: '2024-01-20T00:00:00Z'
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
  }
];

let commentId = 2;

// ===== 3. RESOLVERS =====
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
  },
  
  Mutation: {
    // ===== POST CREATION =====
    createPost: (_, { content, images }) => {
      const newPost = {
        id: `post${mockPosts.length + 1}`,
        content,
        images: images || [],
        video: null,
        author: {
          id: 'current-user',
          name: 'Current User',
          username: 'currentuser',
          email: 'current@example.com',
          avatar: 'https://i.pravatar.cc/150?img=1',
          bio: 'I am the current user',
          followers: 100,
          following: 50,
          verified: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
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
    
    // ===== LIKE/UNLIKE =====
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
    
    // ===== COMMENTS =====
    addComment: (_, { postId, content }) => {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      const currentUser = {
        id: 'current-user',
        name: 'Current User',
        username: 'currentuser',
        email: 'current@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: 'I am the current user',
        followers: 100,
        following: 50,
        verified: true,
        createdAt: '2024-01-01T00:00:00Z'
      };
      
      const newComment = {
        id: `comment${commentId++}`,
        postId,
        content,
        author: currentUser,
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

    // In your backend resolvers, update the sharePost resolver:
    sharePost: (_, args) => {
      const { postId, platform, message } = args;
      const post = mockPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');

      post.shares += 1;

      // Generate a share URL
      const shareUrl = `https://yourdomain.com/post/${postId}`;
      
      console.log(`Post ${postId} shared${platform ? ' on ' + platform : ''}${message ? ' with message: ' + message : ''}`);

      return {
        success: true,
        message: 'Post shared successfully',
        postId,
        shareUrl, // Add this line
        platform: platform || 'web'
      };
    },

    // ===== REACTIONS =====
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
        user: {
          id: 'current-user',
          name: 'Current User',
          username: 'currentuser',
          email: 'current@example.com',
          avatar: 'https://i.pravatar.cc/150?img=1',
          bio: 'I am the current user',
          followers: 100,
          following: 50,
          verified: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        createdAt: new Date().toISOString(),
      };
    },
  }
};

// ===== 4. CREATE SERVER =====
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`✅ ALL User objects now have complete fields`);
});