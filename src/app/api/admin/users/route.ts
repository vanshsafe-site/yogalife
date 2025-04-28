import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';
import { UserCollection } from '@/models/user';

export async function GET(request: Request) {
  try {
    // In a real app, you would check if the user has admin rights
    // For demo purposes, we'll skip authentication
    
    // Get query parameters for pagination and search
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Connect to database
    const client: MongoClient = await clientPromise;
    const db = client.db();
    
    // Build search query
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get users with pagination
    const users = await db.collection(UserCollection)
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .project({
        passwordHash: 0, // Exclude sensitive data
      })
      .toArray();
    
    // Get total count for pagination
    const totalUsers = await db.collection(UserCollection).countDocuments(query);
    
    return NextResponse.json({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 