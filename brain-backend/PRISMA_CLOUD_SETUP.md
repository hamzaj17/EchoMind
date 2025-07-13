# Prisma Cloud Setup Guide for EchoMind Voice Assistant

## Overview
This guide will help you set up Prisma Cloud (Prisma Data Platform) for your AI voice assistant backend.

## Step 1: Create Prisma Cloud Account

1. Go to [Prisma Cloud Console](https://console.prisma.io/)
2. Sign up or log in with your account
3. Create a new project for your voice assistant

## Step 2: Create a Database

1. In the Prisma Cloud Console, click "Create Database"
2. Choose your cloud provider (AWS, Google Cloud, or Azure)
3. Select your region (choose one close to your users)
4. Choose a database name (e.g., `echomind-db`)
5. Wait for the database to be provisioned

## Step 3: Get Connection String

1. Once your database is ready, go to the "Connection" tab
2. Copy the `DATABASE_URL` connection string
3. It should look like: `postgresql://username:password@host:port/database?sslmode=require`

## Step 4: Update Environment Variables

1. Open your `.env` file in the `brain-backend` directory
2. Replace the `DATABASE_URL` with your Prisma Cloud connection string:

```env
# Prisma Cloud Database URL
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Optional: Server configuration
PORT=5000
NODE_ENV=production
```

## Step 5: Push Database Schema

Run the following commands to set up your database:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or create and run migration (for production)
npm run db:migrate
```

## Step 6: Test Your Setup

1. Start your server:
```bash
npm run dev
```

2. Test the health endpoint:
```bash
curl http://localhost:5000/health
```

3. Test adding a task:
```bash
curl -X POST http://localhost:5000/command \
  -H "Content-Type: application/json" \
  -d '{"text": "Add buying milk to my list"}'
```

## Step 7: Voice Assistant Integration

Your Python voice assistant should now work seamlessly with the cloud database. Test it by running:

```bash
cd ../voice-assistant
python voice_assistant.py
```

Say: "Add buying milk to my list" and it should save to your Prisma Cloud database!

## Available Voice Commands

- **Add tasks**: "Add [item] to my list" or "Add [item] to shopping list"
- **View tasks**: "Show my tasks" or "Show shopping tasks"
- **Add notes**: "Take a note [content]" or "Remember [content]"
- **View notes**: "Show my notes"
- **Create lists**: "Create [name] list"
- **View lists**: "Show my lists"
- **Help**: "Help" or "What can you do"

## Database Management

- **View data**: `npm run db:studio` (opens Prisma Studio in browser)
- **Reset database**: `npm run db:reset` (⚠️ This deletes all data!)
- **Generate client**: `npm run db:generate` (after schema changes)

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use `npm run db:migrate` instead of `npm run db:push`
3. Ensure your Prisma Cloud database has sufficient resources
4. Set up monitoring and logging

## Troubleshooting

### Connection Issues
- Verify your `DATABASE_URL` is correct
- Check if your IP is whitelisted in Prisma Cloud
- Ensure SSL is enabled

### Schema Issues
- Run `npm run db:generate` after schema changes
- Use `npm run db:push` to sync schema with database
- Check Prisma Studio for data verification

### Voice Assistant Issues
- Ensure backend is running on port 5000
- Check that Python requests library is installed
- Verify microphone permissions

## Cost Optimization

- Monitor your database usage in Prisma Cloud Console
- Use connection pooling for high-traffic applications
- Consider using Prisma Accelerate for caching

## Support

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Cloud Support](https://support.prisma.io/)
- [Community Forum](https://github.com/prisma/prisma/discussions)