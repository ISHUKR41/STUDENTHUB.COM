import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import tesseract from 'tesseract.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image files are allowed for OCR.'));
    }
  }
});

// OpenAI and Gemini API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callOpenAI(prompt: string, systemPrompt?: string) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(prompt: string, systemPrompt?: string) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser: ${prompt}` : prompt;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: fullPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callAI(prompt: string, systemPrompt?: string) {
  // Try OpenAI first, fallback to Gemini
  try {
    if (OPENAI_API_KEY) {
      return await callOpenAI(prompt, systemPrompt);
    }
  } catch (error) {
    console.warn('OpenAI failed, trying Gemini:', error);
  }

  try {
    if (GEMINI_API_KEY) {
      return await callGemini(prompt, systemPrompt);
    }
  } catch (error) {
    console.warn('Gemini failed:', error);
  }

  throw new Error('Both OpenAI and Gemini APIs are unavailable. Please check your API keys.');
}

// Grammar Checker Tool
router.post('/grammar-check', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const systemPrompt = `You are a professional grammar checker. Analyze the provided text and:
1. Fix all grammar, spelling, and punctuation errors
2. Improve sentence structure and clarity
3. Maintain the original meaning and tone
4. Return the corrected text

Provide your response in this format:
CORRECTED TEXT:
[corrected text here]

CHANGES MADE:
- [list of changes made]

EXPLANATION:
[brief explanation of major improvements]`;

    const result = await callAI(text, systemPrompt);

    res.json({
      success: true,
      originalText: text,
      correctedText: result,
      wordCount: text.split(' ').length
    });

  } catch (error) {
    console.error('Grammar check error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to check grammar. Please try again.' 
    });
  }
});

// Text Summarizer Tool
router.post('/summarize', async (req, res) => {
  try {
    const { text, length } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const lengthInstruction = length === 'short' ? 'in 2-3 sentences' : 
                             length === 'medium' ? 'in 1-2 paragraphs' : 
                             'in 3-4 paragraphs with key details';

    const systemPrompt = `You are a professional text summarizer. Create a clear, concise summary of the provided text ${lengthInstruction}. 
Focus on the main points, key insights, and important conclusions. Maintain objectivity and accuracy.`;

    const result = await callAI(text, systemPrompt);

    const originalWordCount = text.split(' ').length;
    const summaryWordCount = result.split(' ').length;
    const compressionRatio = Math.round((1 - summaryWordCount / originalWordCount) * 100);

    res.json({
      success: true,
      originalText: text,
      summary: result,
      originalWordCount,
      summaryWordCount,
      compressionRatio
    });

  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to summarize text. Please try again.' 
    });
  }
});

// AI Study Planner Tool
router.post('/study-planner', async (req, res) => {
  try {
    const { subject, duration, difficulty, goals, availableTime } = req.body;
    if (!subject || !duration) {
      return res.status(400).json({ error: 'Subject and duration are required' });
    }

    const systemPrompt = `You are an expert study planner. Create a comprehensive, personalized study plan based on the provided information.
Include:
1. Daily/weekly schedule breakdown
2. Specific topics to cover each day
3. Recommended study methods and techniques
4. Practice exercises and review sessions
5. Milestones and progress checkpoints
6. Tips for maintaining motivation

Format your response as a structured study plan with clear headings and actionable items.`;

    const prompt = `Create a study plan for:
- Subject: ${subject}
- Duration: ${duration}
- Difficulty Level: ${difficulty || 'intermediate'}
- Goals: ${goals || 'general mastery'}
- Available Study Time: ${availableTime || '2 hours per day'}`;

    const result = await callAI(prompt, systemPrompt);

    res.json({
      success: true,
      studyPlan: result,
      subject,
      duration,
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Study planner error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to create study plan. Please try again.' 
    });
  }
});

// Smart Flashcards Tool
router.post('/flashcards', async (req, res) => {
  try {
    const { topic, count, difficulty } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const cardCount = parseInt(count) || 10;
    const systemPrompt = `You are an expert educator creating flashcards. Generate ${cardCount} high-quality flashcards for the topic "${topic}".
Each flashcard should have:
- A clear, concise question on the front
- A comprehensive but focused answer on the back
- Appropriate difficulty level: ${difficulty || 'intermediate'}

Format your response as JSON array:
[
  {
    "id": 1,
    "front": "Question here",
    "back": "Answer here",
    "category": "subcategory if applicable"
  },
  ...
]

Focus on key concepts, important facts, and practical applications.`;

    const result = await callAI(`Create flashcards for: ${topic}`, systemPrompt);

    // Try to parse JSON, fallback to text format if needed
    let flashcards;
    try {
      flashcards = JSON.parse(result.replace(/```json\n?|\n?```/g, ''));
    } catch {
      // Fallback: create structured flashcards from text
      const lines = result.split('\n').filter(line => line.trim());
      flashcards = [];
      let currentCard = { id: 1, front: '', back: '', category: topic };
      
      for (let i = 0; i < Math.min(lines.length, cardCount * 2); i += 2) {
        if (lines[i] && lines[i + 1]) {
          flashcards.push({
            id: Math.floor(i / 2) + 1,
            front: lines[i].replace(/^\d+\.\s*/, '').replace(/^(Q:|Question:)\s*/i, ''),
            back: lines[i + 1].replace(/^(A:|Answer:)\s*/i, ''),
            category: topic
          });
        }
      }
    }

    res.json({
      success: true,
      flashcards: flashcards.slice(0, cardCount),
      topic,
      count: Math.min(flashcards.length, cardCount),
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Flashcards error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to create flashcards. Please try again.' 
    });
  }
});

// Formula Solver Tool
router.post('/solve-formula', async (req, res) => {
  try {
    const { formula, variables } = req.body;
    if (!formula) {
      return res.status(400).json({ error: 'Formula is required' });
    }

    const systemPrompt = `You are a mathematics expert. Solve the provided mathematical formula/equation step by step.
Include:
1. Step-by-step solution process
2. Clear explanations for each step
3. Final answer with proper units (if applicable)
4. Any assumptions made
5. Alternative solution methods if relevant

Be precise with mathematical notation and provide educational explanations.`;

    const prompt = `Solve this mathematical problem:
Formula/Equation: ${formula}
${variables ? `Given variables: ${variables}` : ''}

Please provide a complete solution with step-by-step explanation.`;

    const result = await callAI(prompt, systemPrompt);

    res.json({
      success: true,
      formula,
      solution: result,
      variables: variables || null,
      solvedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Formula solver error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to solve formula. Please try again.' 
    });
  }
});

// Screenshot OCR Tool
router.post('/screenshot-ocr', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const { language, enhance } = req.body;
    
    // Perform OCR using Tesseract
    const result = await tesseract.recognize(req.file.buffer, language || 'eng', {
      logger: m => console.log(m)
    });

    const extractedText = result.data.text.trim();
    
    if (!extractedText) {
      return res.status(400).json({ error: 'No text could be extracted from the image' });
    }

    // If enhance is requested, use AI to clean up the text
    let enhancedText = extractedText;
    if (enhance === 'true') {
      try {
        const systemPrompt = `You are a text enhancement specialist. Clean up and improve the provided OCR-extracted text:
1. Fix OCR errors and typos
2. Improve formatting and structure
3. Maintain original meaning
4. Make text more readable

Return only the cleaned text without additional commentary.`;

        enhancedText = await callAI(extractedText, systemPrompt);
      } catch (aiError) {
        console.warn('AI enhancement failed, using raw OCR:', aiError);
      }
    }

    res.json({
      success: true,
      extractedText,
      enhancedText: enhance === 'true' ? enhancedText : null,
      confidence: result.data.confidence,
      wordCount: extractedText.split(' ').filter(word => word.length > 0).length,
      language: language || 'eng'
    });

  } catch (error) {
    console.error('OCR error:', error);
    res.status(500).json({ error: 'Failed to extract text from image. Please try again.' });
  }
});

// Voice to Notes Tool (placeholder for now - would require speech recognition service)
router.post('/voice-to-notes', async (req, res) => {
  try {
    const { audioData, language, enhance } = req.body;
    
    // For now, return a placeholder response
    // In a real implementation, you would use a speech-to-text service like:
    // - Google Speech-to-Text API
    // - Azure Speech Services
    // - AWS Transcribe
    // - AssemblyAI
    
    res.status(501).json({ 
      error: 'Voice recognition feature coming soon. Please use the text input tools for now.' 
    });

  } catch (error) {
    console.error('Voice to notes error:', error);
    res.status(500).json({ error: 'Failed to process voice input. Please try again.' });
  }
});

// Quick Notes Save/Load
const notesStorage = new Map<string, { content: string, createdAt: Date, expiresAt: Date }>();

// Clean expired notes
setInterval(() => {
  const now = new Date();
  Array.from(notesStorage.entries()).forEach(([id, note]) => {
    if (now > note.expiresAt) {
      notesStorage.delete(id);
    }
  });
}, 60000);

router.post('/save-note', async (req, res) => {
  try {
    const { content, title } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    const noteId = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours

    notesStorage.set(noteId, {
      content,
      createdAt: now,
      expiresAt
    });

    res.json({
      success: true,
      noteId,
      title: title || 'Quick Note',
      content,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Save note error:', error);
    res.status(500).json({ error: 'Failed to save note. Please try again.' });
  }
});

router.get('/get-note/:noteId', (req, res) => {
  try {
    const { noteId } = req.params;
    const note = notesStorage.get(noteId);

    if (!note) {
      return res.status(404).json({ error: 'Note not found or expired' });
    }

    if (new Date() > note.expiresAt) {
      notesStorage.delete(noteId);
      return res.status(410).json({ error: 'Note has expired' });
    }

    res.json({
      success: true,
      noteId,
      content: note.content,
      createdAt: note.createdAt.toISOString(),
      expiresAt: note.expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Failed to retrieve note' });
  }
});

export default router;