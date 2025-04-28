import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { MongoClient } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';
import { User, UserCollection } from '@/models/user';

// Generate a unique referral code
function generateReferralCode(name: string): string {
  const baseName = name.replace(/\s+/g, '').toUpperCase().slice(0, 5);
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${baseName}${randomString}`;
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, age, password, referredBy } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !age || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    const client: MongoClient = await clientPromise;
    const db = client.db();
    
    // Check if user already exists
    const existingUser = await db.collection(UserCollection).findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10);
    
    // Generate referral code
    const referralCode = generateReferralCode(name);
    
    // Create new user
    const newUser: Omit<User, '_id'> = {
      name,
      email,
      phone,
      age: Number(age),
      passwordHash: hashedPassword,
      referralCode,
      referredBy: referredBy || undefined,
      points: referredBy ? 0 : 0, // We would add points to the referrer in a real app
      attendance: [],
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Save user to database
    const result = await db.collection(UserCollection).insertOne(newUser);
    
    // Update referrer's points if applicable
    if (referredBy) {
      await db.collection(UserCollection).updateOne(
        { referralCode: referredBy },
        { 
          $inc: { points: 50 },
          $set: { updatedAt: new Date() }
        }
      );
    }
    
    // Return success response without sensitive data
    return NextResponse.json(
      {
        message: 'User created successfully',
        userId: result.insertedId,
        referralCode
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 