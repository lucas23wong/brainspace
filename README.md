<<<<<<< HEAD
# BrainSpace - AI-Powered Interactive Whiteboard

A modern, collaborative whiteboard application with AI-powered features for students, educators, and businesses.

## 🚀 Features

- **Interactive Canvas**: Draw, write, and create with powerful drawing tools
- **AI-Powered Customization**: Let AI transform your ideas into beautiful visualizations
- **Real-time Collaboration**: Work together seamlessly with live updates
- **Smart Templates**: Pre-built templates for mind maps, calendars, sticky notes
- **Cross-Platform**: Optimized for desktop, tablet, and mobile
- **Screen Sharing**: Share your whiteboard in real-time
- **Smart Suggestions**: AI analyzes content and suggests improvements

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Canvas**: Fabric.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API
- **Real-time**: Socket.io
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Supabase for hosted solution)
- OpenAI API key

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd brainspace-whiteboard
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/brainspace_whiteboard"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI
OPENAI_API_KEY="your-openai-api-key-here"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Pusher (for real-time features)
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── whiteboard/        # Whiteboard editor
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── whiteboard/       # Whiteboard-specific components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

## 🎨 Key Components

### WhiteboardCanvas
The core drawing component using Fabric.js for canvas manipulation.

### Dashboard
Main interface for managing whiteboards with search and filtering.

### AI Integration
OpenAI-powered features for content generation and suggestions.

## 🔧 Development

### Adding New Features

1. **Components**: Add to `src/components/`
2. **Pages**: Add to `src/app/`
3. **API Routes**: Add to `src/app/api/`
4. **Database**: Update `prisma/schema.prisma`

### Database Schema

The application uses the following main models:
- `User`: User accounts and authentication
- `Whiteboard`: Whiteboard data and metadata
- `WhiteboardCollaboration`: Collaboration relationships
- `Comment`: Comments and annotations

### Styling

The project uses Tailwind CSS with custom components. See `src/app/globals.css` for custom styles.

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Your application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions

## 🎯 Roadmap

- [ ] Real-time collaboration with WebRTC
- [ ] Advanced AI features (image generation, smart layouts)
- [ ] Mobile app (React Native)
- [ ] Advanced templates (flowcharts, wireframes)
- [ ] Export to various formats (PDF, PNG, SVG)
- [ ] Integration with popular tools (Slack, Teams, etc.)

## 🙏 Acknowledgments

- [Fabric.js](http://fabricjs.com/) for canvas manipulation
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [OpenAI](https://openai.com/) for AI capabilities
=======
# brainspace-repo
Interactive Whiteboard App 
HAHA 
Shout out to the baddies who gon be using this while drinking matcha latte
WE gon make it out
zTRUST 
>>>>>>> 3f527a262f8971e8fdc87d28e9af0c3859ef03dc
