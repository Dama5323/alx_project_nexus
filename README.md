# 🚀 Dynamic Social Media Feed

A modern, production-ready social media feed application built with React, TypeScript, and GraphQL.

## ✨ Features

- **Dynamic Post Loading**: Efficient data fetching with GraphQL
- **Real-time Interactions**: Like, comment, share, and repost functionality
- **Advanced Reactions**: Multiple reaction types (Like, Love, Laugh, Wow, Sad, Angry)
- **Post Analytics**: View counts, engagement metrics, and detailed insights
- **Infinite Scrolling**: Seamless content loading as you scroll
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Mode Support**: Theme switching with user preference persistence
- **Performance Optimized**: Code splitting, lazy loading, and caching strategies

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Apollo Client (GraphQL)
- **Routing**: React Router v6
- **Styling**: CSS3 with CSS Variables
- **Date Handling**: date-fns
- **Build Tool**: Create React App

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- GraphQL backend API (endpoint configuration required)

## 🚀 Getting Started

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/social-feed.git
cd social-feed

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your API endpoint
# REACT_APP_GRAPHQL_ENDPOINT=your_graphql_endpoint_here
```

### Development
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Button, Avatar, Modal, etc.)
│   ├── Feed/           # Feed-related components
│   ├── Post/           # Post components
│   ├── Comment/        # Comment components
│   ├── interactions/   # Interaction components (Share, Repost, etc.)
│   └── analytics/      # Analytics components
├── context/            # React Context providers
├── graphql/            # GraphQL queries, mutations, and fragments
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # Business logic services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
└── styles/             # Global styles
```

## 🎨 Key Features Implementation

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

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_GRAPHQL_ENDPOINT=your_api_endpoint
REACT_APP_WS_ENDPOINT=your_websocket_endpoint
```

### GraphQL Schema Requirements

Your backend should support the following operations:
- Queries: `feed`, `post`, `user`, `postAnalytics`
- Mutations: `createPost`, `likePost`, `addComment`, `addReaction`, `repost`, `sharePost`

## 📱 Progressive Web App (PWA)

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

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing framework
- Apollo team for GraphQL client
- date-fns for date manipulation
- Community contributors

---

**Built with ❤️ for ALX ProDev Frontend Program**