# Vybe - Social Chat & Collaboration Platform

A modern hybrid social platform combining real-time chat, voice/video communication, expressive social features, and lightweight collaboration tools. Built for teens, young adults, and general social users who want an easy, expressive, and safe space to connect, chat, collaborate, and vibe with others pseudonymously.

## 🚀 Features

### Core Features
- **Hybrid Identity System**: Guest access + optional accounts
- **Real-time Chat**: Text messaging with reactions, rich media support, and typing indicators
- **Voice & Video Calls**: 1:1 WebRTC-based calls with high quality audio/video
- **Collaborative Whiteboard**: Multi-user drawing tools with shapes, colors, and export
- **File Sharing**: Upload and share files up to 20MB with preview capabilities
- **Room System**: Multiple room types (global, community, private, ephemeral)
- **User Profiles**: Customizable profiles with avatars, status messages, and themes

### Social Features
- **Expression**: Emoji reactions, GIF support, and rich text formatting
- **Themes**: Dark/light mode with customizable color schemes
- **Status Indicators**: Online/away/busy status with custom messages
- **Friend Lists**: Connect and chat with friends (registered users)

### Safety & Moderation
- **Youth-Safe**: Enhanced moderation and safety features for teen users
- **Content Filtering**: AI-powered content moderation and profanity detection
- **Reporting System**: Easy-to-use reporting for inappropriate content
- **Age Verification**: COPPA-compliant age gating and parental controls

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI**: React 19 with TypeScript 5.x
- **Styling**: Tailwind CSS v4 with CSS variables
- **State Management**: Zustand + React Context + SWR
- **Real-time**: Liveblocks (chat + presence) + LiveKit (WebRTC)
- **Whiteboard**: tldraw with collaborative sync
- **File Handling**: UploadThing integration

### Authentication & Security
- **Auth**: Clerk for hybrid guest/account model
- **Moderation**: OpenAI Moderation API + Profane-Detect
- **Youth Safety**: Enhanced age verification and protection systems

### Development
- **Package Manager**: Bun
- **Code Quality**: ESLint + TypeScript
- **Components**: Reusable UI components with variant support

## 📁 Project Structure

```
vybe/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (auth)/                  # Authentication routes
│   │   ├── dashboard/               # Main app interface
│   │   ├── rooms/                   # Room browsing and management
│   │   ├── profile/                 # User profile management
│   │   ├── api/                     # API routes
│   │   └── (moderation)/            # Safety and reporting
│   ├── components/                   # React components
│   │   ├── auth/                    # Authentication components
│   │   ├── chat/                    # Chat interface components
│   │   ├── calls/                   # Voice/video call components
│   │   ├── whiteboard/              # Collaborative drawing
│   │   ├── layout/                  # Navigation and layout
│   │   └── ui/                      # Reusable UI components
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utilities and configurations
│   │   ├── clerk.ts                 # Clerk configuration
│   │   ├── liveblocks.ts            # Liveblocks setup
│   │   └── livekit.ts               # LiveKit configuration
│   └── types/                       # TypeScript type definitions
├── public/                          # Static assets
├── package.json                     # Dependencies and scripts
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A code editor (VS Code recommended)
- Terminal/command line

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vybe
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or with npm
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API keys:
   ```env
   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Real-time Communication
   NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key
   LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key

   NEXT_PUBLIC_LIVEKIT_URL=your_livekit_server_url
   LIVEKIT_API_KEY=your_livekit_api_key
   LIVEKIT_API_SECRET=your_livekit_api_secret

   # File Storage
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   UPLOADTHING_SECRET=your_uploadthing_secret

   # Content Moderation
   OPENAI_API_KEY=your_openai_api_key

   # External APIs
   GIPHY_API_KEY=your_giphy_api_key
   ```

4. **Run the development server**
   ```bash
   bun dev
   # or with npm
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Authentication Setup

1. **Create a Clerk account** at [clerk.com](https://clerk.com)
2. **Set up your application** with:
   - Social providers (Google, Discord, etc.)
   - Guest user support enabled
   - Age verification and COPPA compliance
   - Webhooks for user events

3. **Configure Clerk middleware** in `src/middleware.ts` for route protection

### Real-time Features

1. **Liveblocks setup**:
   - Create an account at [liveblocks.io](https://liveblocks.io)
   - Set up rooms and permissions
   - Configure presence tracking

2. **LiveKit setup**:
   - Deploy a LiveKit server or use LiveKit Cloud
   - Configure WebRTC signaling
   - Set up room management

### File Storage

1. **UploadThing setup**:
   - Create an account at [uploadthing.com](https://uploadthing.com)
   - Configure file types and size limits
   - Set up CDN delivery

## 📱 Usage Guide

### For Users

#### Guest Access
1. Visit the homepage
2. Click "Continue as Guest"
3. Enter a nickname
4. Join public rooms instantly

#### Full Account
1. Click "Sign Up"
2. Complete registration with age verification
3. Verify email address
4. Access all features including:
   - Room creation
   - Voice/video calls
   - File sharing
   - Whiteboard collaboration
   - Friend lists

#### Using Features

**Chat & Messaging:**
- Join rooms from the dashboard or browse page
- Send text messages with emoji reactions
- Share files and images
- Use voice notes for quick communication

**Voice & Video Calls:**
- Start calls from chat rooms
- Use call controls for audio/video settings
- Screen sharing for collaboration
- Minimize calls while multitasking

**Whiteboard:**
- Access from any room
- Use drawing tools for collaboration
- Add shapes, text, and colors
- Export whiteboard as image

**Profile Customization:**
- Set display name and avatar
- Choose status and emoji
- Customize theme preferences
- Manage privacy settings

### For Developers

#### Adding New Features

1. **Create new components** in appropriate directories:
   ```bash
   src/components/your-feature/
   ```

2. **Add API routes** in `src/app/api/`:
   ```bash
   src/app/api/your-endpoint/
   ```

3. **Update types** in `src/types/`:
   ```typescript
   export interface YourFeature {
     // type definitions
   }
   ```

#### Real-time Features

**Using Liveblocks:**
```typescript
import { liveblocksClient } from '@/lib/liveblocks';
import { useRoom } from '@liveblocks/react';

const { room } = useRoom(roomId);
```

**Using LiveKit:**
```typescript
import { callManager } from '@/lib/livekit';

await callManager.connect(roomId, token);
```

#### Component Development

**UI Components:**
- Use Tailwind for styling
- Follow the existing design system
- Make components responsive
- Add proper TypeScript types

**Authentication:**
- Use the `useClerkAuth` hook
- Protect routes with middleware
- Handle guest vs registered user states

## 🛡️ Safety & Moderation

### Youth Safety Features

- **Age Verification**: Required for all users under 18
- **Content Filtering**: AI-powered moderation for inappropriate content
- **Adult-Minor Interactions**: Additional protections for minor users
- **Reporting System**: Easy-to-use reporting for safety concerns
- **Parental Controls**: Information for parents about safety features

### Content Moderation

- **Automated Filtering**: Real-time content analysis
- **Human Review**: Manual review for reported content
- **User Reporting**: Multiple reporting categories
- **Appeal Process**: Fair review and appeal system

## 🚀 Deployment

### Production Deployment

1. **Build the application**:
   ```bash
   bun build
   ```

2. **Environment setup**:
   - Set production environment variables
   - Configure CORS and security headers
   - Set up SSL certificates

3. **Deploy to platform**:
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS Amplify
   - Docker containers

### Environment Variables

Required production variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=clerk_prod_...
CLERK_SECRET_KEY=clerk_prod_...
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_prod_...
LIVEBLOCKS_SECRET_KEY=sk_prod_...
NODE_ENV=production
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests**:
   ```bash
   bun test
   ```
5. **Submit a pull request**

### Development Guidelines

- Follow the existing code style
- Add TypeScript types for all new features
- Write tests for new functionality
- Update documentation as needed
- Ensure accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discord**: Join our community Discord for help
- **Email**: support@vybe.app for support inquiries

## 🙏 Acknowledgments

- **Clerk** - Authentication and user management
- **Liveblocks** - Real-time collaboration
- **LiveKit** - WebRTC voice/video communication
- **tldraw** - Collaborative whiteboard
- **UploadThing** - File upload and management
- **Vercel** - Hosting and deployment platform

## 📈 Roadmap

### Phase 1: Core Features ✅
- [x] Authentication system
- [x] Real-time chat
- [x] Voice/video calls
- [x] Whiteboard collaboration
- [x] File sharing
- [x] Room management

### Phase 2: Social Features 🚧
- [ ] Friends system
- [ ] User profiles
- [ ] Theme customization
- [ ] Emoji and GIF support
- [ ] Advanced moderation

### Phase 3: Advanced Features 📋
- [ ] Mobile apps (React Native)
- [ ] Group voice rooms
- [ ] Watch-together features
- [ ] Advanced whiteboard tools
- [ ] API for third-party integrations

### Phase 4: Scaling & Performance 📋
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] A/B testing framework
- [ ] Advanced moderation AI
- [ ] Global deployment

---

Built with ❤️ for the next generation of social communication.
