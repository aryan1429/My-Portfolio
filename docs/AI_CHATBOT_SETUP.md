# AI Chatbot Setup Guide

This portfolio now includes an AI chatbot that knows everything about Aryan Aligeti's portfolio, skills, projects, and experience.

## Features

- **Intelligent Conversations**: The AI assistant understands natural language questions about Aryan's portfolio
- **Comprehensive Knowledge**: Knows about all projects, skills, achievements, and experience
- **Real-time Chat**: Instant responses with conversation history
- **Professional Responses**: Provides accurate and helpful information about Aryan's work
- **User-friendly Interface**: Clean, modern chat interface with suggestions

## Setup Instructions

### 1. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API section
4. Create a new API key
5. Copy the API key (starts with `sk-`)

### 2. Configure Environment Variables

1. Copy the environment template:
   ```bash
   cp env/.env.example .env
   ```

2. Add your OpenAI API key to the `.env` file:
   ```bash
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 3. Install Dependencies

The OpenAI dependency is already installed, but if you need to reinstall:

```bash
npm install openai
```

### 4. Start the Application

```bash
# Start the development server
npm run dev

# Start the backend server
npm run dev:server
```

The AI chatbot will be available at `/ai-chat` in the navigation menu.

## How It Works

### Knowledge Base
The AI chatbot uses a comprehensive knowledge base (`server/data/portfolioKnowledge.js`) that includes:

- **Personal Information**: Name, title, contact details, experience
- **Technical Skills**: Frontend, backend, databases, cloud platforms
- **Content Creation Skills**: Video editing, animation, YouTube management  
- **Projects**: Detailed information about all major projects
- **Achievements**: Hackathon wins, YouTube success, project completions
- **Unique Strengths**: Combination of technical and creative skills

### AI Integration
- Uses OpenAI's GPT-3.5-turbo model for intelligent responses
- Maintains conversation context for natural dialogue
- Provides accurate information based on the knowledge base
- Handles errors gracefully with user-friendly messages

### API Endpoint
- **Route**: `POST /api/ai/chat`
- **Payload**: 
  ```json
  {
    "message": "User's question",
    "conversationHistory": [...] // Optional conversation context
  }
  ```
- **Response**:
  ```json
  {
    "response": "AI assistant's reply"
  }
  ```

## Sample Questions Users Can Ask

- "Tell me about Aryan's technical skills"
- "What projects has Aryan worked on?"
- "What is Aryan's experience in content creation?"
- "How can I contact Aryan?"
- "What technologies does Aryan use?"
- "Tell me about Aryan's achievements"
- "What makes Aryan unique as a developer?"
- "Does Aryan have experience with AI projects?"

## Customization

### Updating Knowledge Base
To update the AI's knowledge about Aryan, edit the `server/data/portfolioKnowledge.js` file. The AI will automatically use the updated information.

### Modifying AI Behavior
Adjust the system prompt in `server/server.js` at the AI chat endpoint to change how the AI responds or its personality.

### Styling
The chat interface uses your existing design system with shadcn/ui components and can be customized in `src/pages/AIChat.tsx`.

## Cost Considerations

- OpenAI API usage is charged per token
- GPT-3.5-turbo is cost-effective for most use cases
- Consider implementing rate limiting for production use
- Monitor usage in your OpenAI dashboard

## Troubleshooting

### AI Service Not Available
- Check that `OPENAI_API_KEY` is set correctly in your `.env` file
- Verify your OpenAI account has available credits
- Check server logs for specific error messages

### Slow Responses
- This is normal for the first request (cold start)
- Consider upgrading to a paid OpenAI plan for faster responses
- Implement request caching if needed

### Rate Limits
- OpenAI has rate limits based on your plan
- Implement exponential backoff for retries
- Consider queueing requests for high-traffic scenarios

## Security Notes

- Never commit your `.env` file with the actual API key
- Use environment variables in production
- Consider implementing authentication for the chat endpoint
- Monitor API usage to prevent abuse

---

The AI chatbot provides an interactive way for visitors to learn about Aryan's portfolio and makes the website more engaging and informative!