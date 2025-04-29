import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { MongoClient } from 'mongodb';
import clientPromise, { getDb } from '@/lib/db/mongodb';
import { UserCollection } from '@/models/user';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      // Get database with default name
      const db = await getDb();
      
      // Find the user by email
      const user = await db.collection(UserCollection).findOne({ email });
      
      // Check if user exists
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      // Verify password
      const passwordMatch = await compare(password, user.passwordHash);
      
      if (!passwordMatch) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      // Update last login timestamp
      await db.collection(UserCollection).updateOne(
        { _id: user._id },
        { $set: { lastLogin: new Date(), updatedAt: new Date() } }
      );
      
      // Remove sensitive data before sending response
      const { passwordHash, ...userWithoutPassword } = user;
      
      // Create a response with the user data
      const response = NextResponse.json({
        message: 'Login successful',
        user: userWithoutPassword
      });
      
      // Set a secure HTTP-only cookie with user info
      // This is more secure than localStorage
      response.cookies.set({
        name: 'auth',
        value: JSON.stringify({
          userId: user._id.toString(),
          email: user.email,
          isAdmin: user.email === 'admin@example.com',
        }),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        // Expire in 7 days
        maxAge: 60 * 60 * 24 * 7
      });
      
      return response;
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return NextResponse.json(
        { error: 'Database operation failed. Please try again later.' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
} 