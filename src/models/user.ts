export interface AttendanceRecord {
  date: Date | string;
  durationMinutes: number;
  active: boolean;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  passwordHash: string;
  referralCode: string;
  referredBy?: string;
  points: number;
  attendance: AttendanceRecord[];
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export const UserCollection = 'users'; 