import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise, { getDb } from '@/lib/db/mongodb';
import { UserCollection, AttendanceRecord } from '@/models/user';

export async function POST(request: Request) {
  try {
    // Get request body
    const { durationMinutes } = await request.json();
    
    // Validate required fields
    if (!durationMinutes) {
      return NextResponse.json(
        { error: 'Duration is required' },
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
    
    // Get the auth cookie
    const cookies = request.headers.get('cookie');
    if (!cookies) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the auth cookie
    const cookieList = cookies.split(';');
    const authCookieStr = cookieList.find(c => c.trim().startsWith('auth='));
    
    if (!authCookieStr) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    try {
      // Extract and parse the auth cookie value
      const authCookieValue = decodeURIComponent(authCookieStr.trim().substring(5));
      const authData = JSON.parse(authCookieValue);
      
      // Get the user ID from the cookie
      const userId = authData.userId;
      
      if (!userId) {
        return NextResponse.json(
          { error: 'Invalid authentication data' },
          { status: 401 }
        );
      }

      // Connect to database
      const db = await getDb();
      
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
        badgeEarned
      });
    
    } catch (error) {
      console.error('Error parsing auth cookie:', error);
      return NextResponse.json(
        { error: 'Invalid authentication data' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Error recording attendance:', error);
    return NextResponse.json(
      { error: 'Failed to record attendance' },
      { status: 500 }
    );
  }
} 