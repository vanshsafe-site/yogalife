import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';
import { UserCollection } from '@/models/user';

export async function POST(request: Request) {
  try {
    // In a real app, you would check if the user has admin rights
    // For demo purposes, we'll skip authentication
    
    const { userId, points, reason } = await request.json();
    
    // Validate required fields
    if (!userId || points === undefined) {
      return NextResponse.json(
        { error: 'User ID and points are required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    const client: MongoClient = await clientPromise;
    const db = client.db();
    
    // Update user points
    const result = await db.collection(UserCollection).updateOne(
      { _id: new ObjectId(userId) },
      { 
        $inc: { points: points },
        $push: {
          pointsHistory: {
            points,
            reason: reason || 'Admin adjustment',
            date: new Date()
          }
        },
        $set: { updatedAt: new Date() }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get updated user points
    const user = await db.collection(UserCollection).findOne(
      { _id: new ObjectId(userId) },
      { projection: { points: 1 } }
    );
    
    return NextResponse.json({
      message: 'Points updated successfully',
      currentPoints: user?.points || 0
    });
    
  } catch (error) {
    console.error('Error updating points:', error);
    return NextResponse.json(
      { error: 'Failed to update points' },
      { status: 500 }
    );
  }
} 