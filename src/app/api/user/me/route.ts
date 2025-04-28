import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';
import { UserCollection } from '@/models/user';

export async function GET(request: Request) {
  try {
    // In a real app, you would get the user ID from a session or JWT token
    // For demo purposes, we'll extract it from a query parameter
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const client: MongoClient = await clientPromise;
    const db = client.db();
    
    // Find user by ID
    const user = await db.collection(UserCollection).findOne(
      { _id: new ObjectId(userId) }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;
    
    // Generate badge progress information
    const badges = [
      {
        name: '100 Days',
        earned: user.daysAttended >= 100,
        progress: Math.min(user.daysAttended, 100)
      },
      {
        name: '200 Days',
        earned: user.daysAttended >= 200,
        progress: Math.min(user.daysAttended, 200)
      },
      {
        name: '300 Days',
        earned: user.daysAttended >= 300,
        progress: Math.min(user.daysAttended, 300)
      }
    ];
    
    // Get recent activity (last 5 attendance records)
    const recentActivity = user.attendance
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    return NextResponse.json({
      ...userWithoutPassword,
      badges,
      recentActivity
    });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 