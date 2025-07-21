# Google Authentication Setup Guide

## 1. Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/brainspace_whiteboard"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Google OAuth (you'll need to get these from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI (for AI features)
OPENAI_API_KEY="your-openai-api-key"
```

## 2. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret to your `.env` file

## 4. Database Setup

1. Install PostgreSQL if you haven't already
2. Create a database:
   ```sql
   CREATE DATABASE brainspace_whiteboard;
   ```
3. Update the DATABASE_URL in your `.env` file with your actual database credentials
4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

## 5. Start the Application

```bash
npm run dev
```

## 6. Test Authentication

1. Visit `http://localhost:3000/auth/signin`
2. Click "Continue with Google"
3. You should be redirected to Google's OAuth consent screen
4. After successful authentication, you'll be redirected to the dashboard

## Troubleshooting

- Make sure all environment variables are set correctly
- Check that the Google OAuth redirect URIs match exactly
- Ensure the database is running and accessible
- Check the browser console and server logs for any errors 