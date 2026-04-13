import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/jwt';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ code: 400, message: 'Username and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ username });
    
    // Ensure user exists before comparing passwords
    if (!user) {
      return NextResponse.json({ code: 401, message: 'Invalid credentials' }, { status: 401 });
    }

    // Use bcrypt to compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ code: 401, message: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signJWT({ id: user._id.toString(), username: user.username });

    return NextResponse.json({
      code: 200,
      message: 'success',
      data: {
        token,
        user: {
          username: user.username,
          email: user.email,
        }
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { code: 500, message: 'Internal Server Error', error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
