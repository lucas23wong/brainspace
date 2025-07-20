#!/bin/bash

echo "🚀 BrainSpace Environment Setup"
echo "================================"

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Create .env.local file
cat > .env.local << EOF
# OpenAI API Key (Required for AI features)
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Database URL (for Prisma)
DATABASE_URL="postgresql://username:password@localhost:5432/brainspace"

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo "✅ Created .env.local file"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local and add your OpenAI API key"
echo "2. Get your API key from: https://platform.openai.com/api-keys"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "🔑 To get an OpenAI API key:"
echo "   - Go to https://platform.openai.com/"
echo "   - Sign up or log in"
echo "   - Go to API Keys section"
echo "   - Create a new API key"
echo "   - Copy the key and paste it in .env.local"
echo ""
echo "⚠️  Note: Without an OpenAI API key, AI features will use fallback templates" 