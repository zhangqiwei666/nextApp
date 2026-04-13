import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Feed from '@/models/Feed';

export async function GET() {
  await dbConnect();
  
  try {
    const feeds = await Feed.find({}).lean();
    return NextResponse.json({
      code: 200,
      message: 'success',
      data: feeds,
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
