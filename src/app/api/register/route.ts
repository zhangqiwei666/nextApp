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

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ code: 409, message: 'User already exists' }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      passwordHash: hashedPassword,
      email: `${username}@example.com`,
    });

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
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
