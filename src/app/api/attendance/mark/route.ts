import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';
import { UserCollection, AttendanceRecord } from '@/models/user';

export async function POST(request: Request) {
  try {
    const { userId, durationMinutes } = await request.json();

    // Validate required fields
    if (!userId || !durationMinutes) {
      return NextResponse.json(
        { error: 'User ID and duration are required' },
        { status: 400 }
      );
    }

    // Validate duration (minimum 5 minutes to count as attendance)
    if (durationMinutes < 5) {
      return NextResponse.json(
        { error: 'Session must be at least 5 minutes to be counted' },
        { status: 400 }
      );
    }

    // Connect to database
    const client: MongoClient = await clientPromise;
    const db = client.db();
    
    // Create attendance record
    const attendanceRecord: AttendanceRecord = {
      date: new Date(),
      durationMinutes,
      active: true
    };
    
    // Update user with new attendance record and increment points
    const result = await db.collection(UserCollection).updateOne(
      { _id: new ObjectId(userId) },
      { 
        $push: { attendance: attendanceRecord },
        $inc: { points: 1, daysAttended: 1 }, // Add 1 point per session
        $set: { updatedAt: new Date() }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if user has reached any badge milestones
    const user = await db.collection(UserCollection).findOne(
      { _id: new ObjectId(userId) },
      { projection: { daysAttended: 1 } }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Badge logic - could be more sophisticated in a real app
    let badgeEarned = null;
    if (user.daysAttended === 100) {
      badgeEarned = '100 Days';
    } else if (user.daysAttended === 200) {
      badgeEarned = '200 Days';
    } else if (user.daysAttended === 300) {
      badgeEarned = '300 Days';
    }
    
    return NextResponse.json({
      message: 'Attendance recorded successfully',
      badgeEarned,
      points: user.daysAttended // Total number of points (same as days attended in this simple model)
    });
    
  } catch (error) {
    console.error('Error recording attendance:', error);
    return NextResponse.json(
      { error: 'Failed to record attendance' },
      { status: 500 }
    );
  }
} 