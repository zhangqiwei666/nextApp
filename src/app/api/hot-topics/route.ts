import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import HotTopic from '@/models/HotTopic';

export async function GET() {
  await dbConnect();
  
  try {
    const topics = await HotTopic.find({}).sort({ rank: 1 }).lean();
    return NextResponse.json({
      code: 200,
      message: 'success',
      data: topics,
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
