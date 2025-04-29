import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { MongoClient } from 'mongodb';
import clientPromise, { getDb } from '@/lib/db/mongodb';
import { User, UserCollection } from '@/models/user';

// Generate a unique referral code
function generateReferralCode(name: string): string {
  const baseName = name.replace(/\s+/g, '').toUpperCase().slice(0, 5);
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${baseName}${randomString}`;
}

export async function POST(request: Request) {
  console.log("Signup route: Processing new signup request");
  
  try {
    const { name, email, phone, age, password, referredBy } = await request.json();
    console.log(`Signup route: Received signup request for email: ${email}`);

    // Validate required fields
    if (!name || !email || !phone || !age || !password) {
      console.log("Signup route: Missing required fields");
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      // Get database with default name
      console.log("Signup route: Attempting to get database connection");
      const db = await getDb();
      console.log("Signup route: Successfully connected to database");
      
      // Check if user already exists
      console.log(`Signup route: Checking if user with email ${email} already exists`);
      const existingUser = await db.collection(UserCollection).findOne({ email });
      if (existingUser) {
        console.log(`Signup route: User with email ${email} already exists`);
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      
      // Hash password
      console.log("Signup route: Hashing password");
      const hashedPassword = await hash(password, 10);
      
      // Generate referral code
      const referralCode = generateReferralCode(name);
      console.log(`Signup route: Generated referral code: ${referralCode}`);
      
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
      console.log("Signup route: Attempting to insert new user into database");
      const result = await db.collection(UserCollection).insertOne(newUser);
      console.log(`Signup route: User created with ID: ${result.insertedId}`);
      
      // Update referrer's points if applicable
      if (referredBy) {
        console.log(`Signup route: Updating points for referrer with code: ${referredBy}`);
        await db.collection(UserCollection).updateOne(
          { referralCode: referredBy },
          { 
            $inc: { points: 50 },
            $set: { updatedAt: new Date() }
          }
        );
      }
      
      // Return success response without sensitive data
      console.log("Signup route: Returning success response");
      return NextResponse.json(
        {
          message: 'User created successfully',
          userId: result.insertedId,
          referralCode
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Signup route: Database operation failed:', dbError);
      console.error('Error details:', JSON.stringify(dbError, null, 2));
      if (dbError instanceof Error) {
        console.error('Error stack:', dbError.stack);
      }
      
      return NextResponse.json(
        { 
          error: 'Database operation failed. Please try again later.',
          details: dbError instanceof Error ? dbError.message : String(dbError)
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Signup route: Error creating user:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 