/**
 * @jest-environment node
 */

import { POST } from './route';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';

// Mock the MongoDB ObjectId
jest.mock('mongodb', () => {
  const originalModule = jest.requireActual('mongodb');
  
  // Create a mock ObjectId class/function
  const mockObjectId = jest.fn(id => id);
  mockObjectId.isValid = jest.fn().mockReturnValue(true);
  
  return {
    ...originalModule,
    ObjectId: mockObjectId
  };
});

// Mock MongoDB client
jest.mock('@/lib/mongodb', () => {
  const mockInsertOne = jest.fn().mockResolvedValue({ insertedId: 'mock-id' });
  const mockFindOne = jest.fn();
  const mockUpdateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
  
  return {
    __esModule: true,
    default: Promise.resolve({
      db: () => ({
        collection: () => ({
          findOne: mockFindOne,
          insertOne: mockInsertOne,
          updateOne: mockUpdateOne
        })
      })
    }),
    mockFindOne,
    mockInsertOne,
    mockUpdateOne
  };
});

describe('Attendance API', () => {
  const mockUserId = 'user-123';
  const mockClassId = 'class-456';

  beforeEach(() => {
    jest.clearAllMocks();
    const { mockFindOne } = require('@/lib/mongodb');
    
    // Mock valid user and class responses
    mockFindOne
      .mockResolvedValueOnce({ _id: mockUserId, name: 'Test User' }) // User exists
      .mockResolvedValueOnce({ _id: mockClassId, name: 'Yoga Class' }); // Class exists
  });

  it('should return 400 if required fields are missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/attendance/record', {
      method: 'POST',
      body: JSON.stringify({ userId: mockUserId })
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('Missing required fields');
  });

  it('should return 404 if user is not found', async () => {
    const { mockFindOne } = require('@/lib/mongodb');
    mockFindOne.mockReset();
    mockFindOne.mockResolvedValueOnce(null); // User not found

    const req = new NextRequest('http://localhost:3000/api/attendance/record', {
      method: 'POST',
      body: JSON.stringify({ 
        userId: mockUserId,
        classId: mockClassId,
        date: new Date().toISOString()
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('User not found');
  });

  it('should record attendance and award points', async () => {
    const { mockFindOne, mockInsertOne } = require('@/lib/mongodb');
    mockFindOne.mockReset();
    
    // Mock user and class exist, but no existing attendance
    mockFindOne
      .mockResolvedValueOnce({ _id: mockUserId, name: 'Test User' }) // User exists
      .mockResolvedValueOnce({ _id: mockClassId, name: 'Yoga Class' }) // Class exists
      .mockResolvedValueOnce(null); // No existing attendance

    mockInsertOne.mockResolvedValueOnce({ insertedId: 'mock-attendance-id' });

    const req = new NextRequest('http://localhost:3000/api/attendance/record', {
      method: 'POST',
      body: JSON.stringify({ 
        userId: mockUserId,
        classId: mockClassId,
        date: new Date().toISOString()
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.message).toBe('Attendance recorded successfully');
    expect(data.pointsAwarded).toBe(10);
  });
}); 