import { NextRequest, NextResponse } from 'next/server';
import textToSpeech, { protos } from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text } = body;

  if (!text) {
    return NextResponse.json({ error: 'Text input is required' }, { status: 400 });
  }

  const client = new textToSpeech.TextToSpeechClient({
    keyFilename: path.join(process.cwd(), 'googleservicekey.json'),
  });

  const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL },
    audioConfig: { audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const filePath = path.join(process.cwd(), 'public', 'output.mp3');
    fs.writeFileSync(filePath, response.audioContent as Buffer, 'binary');
    return NextResponse.json({ message: 'Speech synthesis successful', filePath: '/output.mp3' });
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
}