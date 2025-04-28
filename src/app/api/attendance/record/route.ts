import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

// POST /api/attendance/record
// Records attendance for a user
export async function POST(req: NextRequest) {
  try {
    const { userId, classId, date } = await req.json();

    // Validate required fields
    if (!userId || !classId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, classId, and date are required' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(classId)) {
      return NextResponse.json(
        { error: 'Invalid userId or classId format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // First check if user exists
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if class exists
    const yogaClass = await db.collection('classes').findOne({
      _id: new ObjectId(classId)
    });

    if (!yogaClass) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    // Check if attendance already recorded
    const existingAttendance = await db.collection('attendance').findOne({
      userId: new ObjectId(userId),
      classId: new ObjectId(classId),
      date: new Date(date)
    });

    if (existingAttendance) {
      return NextResponse.json(
        { message: 'Attendance already recorded for this class', attendance: existingAttendance },
        { status: 200 }
      );
    }

    // Record attendance
    const attendance = {
      userId: new ObjectId(userId),
      classId: new ObjectId(classId),
      date: new Date(date),
      className: yogaClass.name,
      createdAt: new Date(),
    };

    const result = await db.collection('attendance').insertOne(attendance);

    // Award points for attendance (if implemented)
    // Default 10 points per class attendance
    const POINTS_PER_ATTENDANCE = 10;
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { points: POINTS_PER_ATTENDANCE },
        $push: { 
          pointsHistory: {
            points: POINTS_PER_ATTENDANCE,
            reason: `Attendance for ${yogaClass.name}`,
            date: new Date()
          }
        }
      }
    );

    return NextResponse.json(
      { 
        message: 'Attendance recorded successfully',
        attendance: {
          ...attendance,
          _id: result.insertedId
        },
        pointsAwarded: POINTS_PER_ATTENDANCE
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error recording attendance:', error);
    return NextResponse.json(
      { error: 'Failed to record attendance', details: error.message },
      { status: 500 }
    );
  }
} 