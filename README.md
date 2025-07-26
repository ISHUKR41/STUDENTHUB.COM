# PDF Tools Website

A modern, responsive web application for PDF and document processing tools powered by React, TypeScript, and Gemini AI.

## Project info

**URL**: https://lovable.dev/projects/b54a7d80-b64c-405a-92a4-1bc6beaa8758

## Features

### PDF Tools
- **Protect PDF**: Password-protect PDFs with encryption
- **Merge PDF**: Combine multiple PDFs into one
- **Split PDF**: Extract pages from PDFs
- **Compress PDF**: Reduce PDF file sizes
- **PDF to Word**: Convert PDFs to editable Word documents
- **PDF to PowerPoint**: Convert PDFs to PowerPoint presentations

### Image Tools
- **Resize Images**: Adjust image dimensions
- **Compress Images**: Optimize image file sizes

### Text Tools
- **Text to PDF**: Convert text documents to PDF format

### AI Assistant
- **Gemini Integration**: AI-powered assistance for file processing tasks
- **Context-aware suggestions**: Tool-specific recommendations
- **Technical guidance**: Step-by-step instructions for complex tasks

## AI Integration Security

### Secure Gemini API Setup

Your Gemini API key is securely integrated without exposing it to the frontend. Here's how to set up the backend:

#### Backend Setup (Express.js)

Create a secure backend proxy:

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = 'AIzaSyD3MSLQz7xGQFb7gMMv5Dcb4lYF7gQco50'; // Your API key
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    });

    const generatedText = response.data.candidates[0].content.parts[0].text;
    res.json({ result: generatedText });

  } catch (error) {
    console.error('Gemini Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Gemini API error. Try again later.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### Environment Variables

For production, use environment variables:

```bash
# .env
GEMINI_API_KEY=AIzaSyD3MSLQz7xGQFb7gMMv5Dcb4lYF7gQco50
PORT=3001
```

#### Frontend Configuration

Update the Gemini service configuration:

```typescript
// src/lib/gemini.ts
export class GeminiService {
  private static baseUrl = 'http://localhost:3001/api/gemini'; // Your backend URL
  // ... rest of the implementation
}
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b54a7d80-b64c-405a-92a4-1bc6beaa8758) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b54a7d80-b64c-405a-92a4-1bc6beaa8758) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
