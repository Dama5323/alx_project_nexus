#  Dynamic Social Media Feed

A modern, full-stack social feed application built with React, TypeScript, GraphQL, and Supabase. This project was developed as part of the ALX Software Engineering program to demonstrate proficiency in building scalable, real-time social media platforms.

## 🌐 Live Demo

[View Live Demo](alx-social-feed.vercel.app/cel.app)

##  Features

- **Dynamic Post Loading**: Efficient data fetching with GraphQL
- **Real-time Interactions**: Like, comment, share, and repost functionality
- **Advanced Reactions**: Multiple reaction types (Like, Love, Laugh, Wow, Sad, Angry)
- **Post Analytics**: View counts, engagement metrics, and detailed insights
- **Multi-provider Authentication**: Email/password, Google, and LinkedIn login
- **Media Upload**: Image and video support with Cloudinary
- **Infinite Scrolling**: Seamless content loading as you scroll
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Mode Support**: Theme switching with user preference persistence


## Tech Stack

### Frontend
- **Framework**: React 18, TypeScript
- **State Management**: Apollo Client (GraphQL)
- **Routing**: React Router v6
- **Styling**: CSS3 with CSS Variables
- **Authentication**: Supabase Auth (Email/Password, Google, LinkedIn)
- **Media**: Cloudinary for image/video optimization

### Backend
- **API**: GraphQL (Apollo Server)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Cloudinary

## Prerequisite

- Node.js 18+ and npm/yarn
- Supabase account (for auth and database)
- Cloudinary account (for media uploads)
- GraphQL backend API

##  Getting Started

### Installation
```bash
# Clone the repository
git clone https://github.com/Dama5323/alx_project_nexus.git
cd alx_project_nexus/social-feed

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## Environment Configuration
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# GraphQL Endpoint
VITE_GRAPHQL_ENDPOINT=your_graphql_endpoint

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

## Development
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

The app will be available at `http://localhost:3000`
```


## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components (Google, LinkedIn login)
│   ├── Post/           # Post components with interactions
│   ├── Comment/        # Comment threads and replies
│   ├── Feed/           # Infinite scrolling feed
│   ├── analytics/      # Post performance metrics
│   ├── notifications/  # Real-time user alerts
│   └── trending/       # Popular hashtags and topics
├── context/            # React Context providers
├── graphql/            # GraphQL queries and mutations
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # Supabase and API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions `   
```

## Authentication
The app supports multiple authentication methods through Supabase:

    - Email/Password - Standard registration and login

    - Google OAuth - One-click login with Google account

    - LinkedIn OAuth - Professional network authentication

Authentication flow:

    1. User selects login method

    2. Supabase handles OAuth redirects

    3. JWT token stored for API authorization

    4. User session persisted across page reloads


## Key Features Implementation

### Post Interactions
- Like/Unlike posts with optimistic updates
- Comment with nested replies
- Share via multiple platforms
- Repost with or without comments
- Save posts for later

### Analytics & Insights
- Real-time view tracking
- Engagement metrics
- Reach analytics
- Top viewer locations
- Peak engagement times

### User Experience
- Skeleton loading states
- Error boundaries for graceful error handling
- Responsive image galleries
- Infinite scroll pagination
- Keyboard shortcuts

## Configuration

### Environment Variables
```env
REACT_APP_GRAPHQL_ENDPOINT=your_api_endpoint
REACT_APP_WS_ENDPOINT=your_websocket_endpoint
```

### GraphQL Schema Requirements

Your backend should support the following operations:
- Queries: `feed`, `post`, `user`, `postAnalytics`
- Mutations: `createPost`, `likePost`, `addComment`, `addReaction`, `repost`, `sharePost`

## Progressive Web App (PWA)

The app includes PWA support:
- Offline capability
- Install to home screen
- Push notifications (when enabled)

## 🧪 Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 🚀 Deployment

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📝 Best Practices Implemented

- ✅ Type-safe with TypeScript
- ✅ Component composition and reusability
- ✅ Custom hooks for business logic
- ✅ Optimistic UI updates
- ✅ Error boundaries
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Performance optimization (memoization, lazy loading)
- ✅ Responsive design
- ✅ Clean code architecture

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
1. Fork the repository

2. Create your feature branch (git checkout -b feature/AmazingFeature)

3. Commit your changes (git commit -m 'Add some AmazingFeature')

4. Push to the branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name - [Damaris Chege](https://github.com/Dama5323)

## 🙏 Acknowledgments

- ALX Africa for the comprehensive software engineering program

- Supabase team for excellent authentication and database services

- Cloudinary for media optimization

- React and Apollo communities for amazing tools

---

**Built with ❤️ for ALX ProDev Frontend Program**