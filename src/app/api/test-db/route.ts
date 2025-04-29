import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongodb';

export async function GET() {
  try {
    console.log('Test-DB route: Attempting to connect to MongoDB...');
    
    // Try to access the database
    const db = await getDb();
    
    // Try a simple operation
    const stats = await db.stats();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      databaseName: db.databaseName,
      collections: await db.listCollections().toArray(),
      stats
    });
  } catch (error) {
    console.error('Test-DB route: Error connecting to MongoDB:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to database',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 });
  }
} 