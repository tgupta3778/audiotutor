import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

// generates a numbered summary of provided text using Gemini API
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text } = body;

  // Validate input
  if (!text) {
    return NextResponse.json({ error: 'Text input is required' }, { status: 400 });
  }

  // Retrieve Gemini API token from environment variables
  const geminiApiToken = process.env.GEMINI_API_TOKEN;
  if (!geminiApiToken) {
    return NextResponse.json({ error: 'Gemini API token is not configured' }, { status: 500 });
  }

  // Initialize Gemini API client
  const client = new GoogleGenAI({
    apiKey: geminiApiToken,
  });

  try {
    // Send request to Gemini model to generate numbered summary
    const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        //prompt:
        contents: "Create a non markdown, short, numbered list summary with key points of this for me. Put each number on its own line: " + text,
      });
      console.log(response.text);

    // Return summary as JSON
    return NextResponse.json({ message: 'Summary generated successfully', summary: response.text });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}