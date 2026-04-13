import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const replyText = `You said: "${message}". This is a mock AI response from our new internal Next.js API!`;
        const words = replyText.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          // Simulate latency
          await new Promise(resolve => setTimeout(resolve, 100));
          const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
