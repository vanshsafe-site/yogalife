import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { MongoClient } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';
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

    // Connect to database
    const client: MongoClient = await clientPromise;
    const db = client.db();
    
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
    
    // In a real app, you would set a session or JWT token here
    
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
} 