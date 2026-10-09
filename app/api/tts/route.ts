import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, speaker = 'shubh', pace = 1.05 } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
    }

    const sarvamApiKey = process.env.SARVAM_API_KEY || '';

    if (sarvamApiKey) {
      try {
        const response = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': sarvamApiKey,
          },
          body: JSON.stringify({
            inputs: [text],
            target_language_code: 'en-IN',
            speaker: speaker,
            pace: pace,
            speech_sample_rate: 22050,
            enable_preprocessing: true,
            model: 'bulbul:v1',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const base64Audio = data.audios?.[0];
          if (base64Audio) {
            return NextResponse.json({
              audioBase64: base64Audio,
              mimeType: 'audio/wav',
              provider: 'sarvam',
            });
          }
        } else {
          const errText = await response.text();
          console.warn('[Sarvam TTS API Error]:', response.status, errText);
        }
      } catch (err) {
        console.warn('[Sarvam Fetch Failed]:', err);
      }
    }

    // Return fallback provider indicator
    return NextResponse.json({
      audioBase64: null,
      provider: 'pre-recorded',
      message: 'Using high-fidelity pre-recorded audio bundle',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'TTS generation failed' }, { status: 500 });
  }
}
