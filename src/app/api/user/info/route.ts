import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(request: Request) {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ code: 400, message: 'Username is required' }, { status: 400 });
    }

    const user = await User.findOne({ username }).lean();
    
    if (!user) {
      return NextResponse.json({ code: 404, message: 'User not found' }, { status: 404 });
    }

    // Remove sensitive data before returning
    const { passwordHash, ...safeUserData } = user as any;

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: safeUserData,
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
