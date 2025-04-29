import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise, { getDb } from '@/lib/db/mongodb';
import { UserCollection } from '@/models/user';

export async function GET(request: Request) {
  try {
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
      
      // Ensure dates are properly formatted
      const formattedAttendance = Array.isArray(user.attendance) 
        ? user.attendance.map((record: any) => ({
            ...record,
            date: record.date instanceof Date ? record.date.toISOString() : record.date
          }))
        : [];
      
      return NextResponse.json({
        ...userWithoutPassword,
        badges,
        attendance: formattedAttendance,
        joinDate: user.joinDate instanceof Date ? user.joinDate.toISOString() : user.joinDate
      });
    } catch (error) {
      console.error('Error parsing auth cookie:', error);
      return NextResponse.json(
        { error: 'Invalid authentication data' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 