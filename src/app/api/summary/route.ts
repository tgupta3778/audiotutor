import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text } = body;

  if (!text) {
    return NextResponse.json({ error: 'Text input is required' }, { status: 400 });
  }

  const geminiApiToken = process.env.GEMINI_API_TOKEN;
  if (!geminiApiToken) {
    return NextResponse.json({ error: 'Gemini API token is not configured' }, { status: 500 });
  }

  const client = new GoogleGenAI({
    apiKey: geminiApiToken,
  });

  try {
    const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Create a non markdown, short, numbered list summary with key points of this for me. Put each number on its own line: " + text,
      });
      console.log(response.text);

    return NextResponse.json({ message: 'Summary generated successfully', summary: response.text });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}