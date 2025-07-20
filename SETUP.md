# BrainSpace AI Whiteboard Setup Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brainspace-repo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI API Key (Required for AI features)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Database URL (for Prisma)
   DATABASE_URL="postgresql://username:password@localhost:5432/brainspace"
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Get OpenAI API Key**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Create an account or sign in
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key and paste it in your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 AI Whiteboard Features

### Available Templates
- **Calendar**: Perfect for scheduling and planning
- **Mind Map**: Organize ideas and concepts
- **Timeline**: Track projects and milestones
- **Kanban**: Manage workflows and tasks
- **Study Notes**: Organized note-taking template
- **Flowchart**: Process and decision mapping
- **Custom**: AI-generated layouts based on your description

### How to Use AI Features

1. **Create New Whiteboard**
   - Click "New Whiteboard" on the dashboard
   - Choose "AI Generated" template
   - Or select any other template to start

2. **AI Prompt Examples**
   - "Create a calendar for my project deadlines"
   - "Set up a mind map for brainstorming ideas"
   - "Make a timeline for our product launch"
   - "Create a task management board for my team"
   - "Set up study notes for physics chapter 5"

3. **Customize Your Whiteboard**
   - Use drawing tools (pen, shapes, text)
   - Add sticky notes and images
   - Change colors and styles
   - Collaborate with team members

## 🛠️ Whiteboard Tools

### Drawing Tools
- **Pen**: Freehand drawing with adjustable size
- **Eraser**: Remove drawn content
- **Select**: Select and modify objects
- **Move**: Pan around the canvas

### Shapes & Objects
- **Shapes**: Rectangle, circle, triangle, diamond, line
- **Text**: Add editable text elements
- **Sticky Notes**: Add colored sticky notes
- **Images**: Upload and add images

### Advanced Features
- **Undo/Redo**: History management
- **Color Picker**: Extensive color palette
- **Download**: Export as PNG image
- **AI Assistant**: Generate layouts anytime

## 🔧 Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Canvas**: Fabric.js for drawing functionality
- **AI**: OpenAI GPT-4 for template generation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js

## 🐛 Troubleshooting

### Common Issues

1. **AI not working**
   - Check your OpenAI API key in `.env.local`
   - Ensure you have credits in your OpenAI account
   - Check browser console for errors

2. **Canvas not loading**
   - Clear browser cache
   - Check if Fabric.js is properly installed
   - Ensure all dependencies are installed

3. **Styling issues**
   - Run `npm run build` to check for CSS issues
   - Clear browser cache
   - Check Tailwind CSS configuration

### Getting Help

- Check the browser console for error messages
- Review the terminal output for build errors
- Ensure all environment variables are set correctly

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- Ensure all environment variables are set
- Build the project: `npm run build`
- Start the production server: `npm start`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy Whiteboarding! 🎨✨** 