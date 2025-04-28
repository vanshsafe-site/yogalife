/**
 * @jest-environment node
 */

import { POST } from './route';
import { NextRequest } from 'next/server';
import { compare } from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

// Mock MongoDB client
jest.mock('@/lib/db/mongodb', () => {
  const mockFindOne = jest.fn();
  const mockUpdateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
  
  return {
    __esModule: true,
    default: Promise.resolve({
      db: () => ({
        collection: () => ({
          findOne: mockFindOne,
          updateOne: mockUpdateOne
        })
      })
    }),
    mockFindOne,
    mockUpdateOne
  };
});

describe('Login API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email or password is missing', async () => {
    // Test with missing email
    const reqWithoutEmail = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'password123' })
    });

    const responseWithoutEmail = await POST(reqWithoutEmail);
    expect(responseWithoutEmail.status).toBe(400);
    const dataWithoutEmail = await responseWithoutEmail.json();
    expect(dataWithoutEmail.error).toBe('Email and password are required');

    // Test with missing password
    const reqWithoutPassword = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' })
    });

    const responseWithoutPassword = await POST(reqWithoutPassword);
    expect(responseWithoutPassword.status).toBe(400);
    const dataWithoutPassword = await responseWithoutPassword.json();
    expect(dataWithoutPassword.error).toBe('Email and password are required');
  });

  it('should return 401 if user is not found', async () => {
    const { mockFindOne } = require('@/lib/db/mongodb');
    mockFindOne.mockResolvedValueOnce(null); // User not found

    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ 
        email: 'nonexistent@example.com',
        password: 'password123'
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Invalid email or password');
  });

  it('should return 401 if password does not match', async () => {
    const { mockFindOne } = require('@/lib/db/mongodb');
    mockFindOne.mockResolvedValueOnce({ 
      _id: '123', 
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      name: 'Test User'
    });
    
    // Mock bcrypt to return false (password doesn't match)
    (compare as jest.Mock).mockResolvedValueOnce(false);

    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ 
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Invalid email or password');
  });

  it('should return 200 and user data if login is successful', async () => {
    const mockUser = { 
      _id: '123', 
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      name: 'Test User',
      points: 50,
      role: 'user'
    };
    
    const { mockFindOne, mockUpdateOne } = require('@/lib/db/mongodb');
    mockFindOne.mockResolvedValueOnce(mockUser);
    
    // Mock bcrypt to return true (password matches)
    (compare as jest.Mock).mockResolvedValueOnce(true);

    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ 
        email: 'test@example.com',
        password: 'correctpassword'
      })
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    
    // Check that the right data is returned
    expect(data.message).toBe('Login successful');
    expect(data.user).toEqual(expect.objectContaining({
      _id: '123',
      email: 'test@example.com',
      name: 'Test User',
      points: 50,
      role: 'user'
    }));
    
    // Password hash should not be included
    expect(data.user.passwordHash).toBeUndefined();
    
    // Verify lastLogin was updated
    expect(mockUpdateOne).toHaveBeenCalled();
  });
}); 