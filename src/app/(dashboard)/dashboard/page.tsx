'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define interfaces for our types
interface AttendanceRecord {
  date: string;
  durationMinutes: number;
  active: boolean;
}

interface Referral {
  name: string;
  date: string;
  status: string;
}

interface Badge {
  name: string;
  earned: boolean;
  progress: number;
}

interface User {
  _id?: string;
  name: string;
  email: string;
  joinDate: string;
  points: number;
  daysAttended: number;
  referralCode: string;
  referrals: Referral[];
  attendance: AttendanceRecord[];
  badges: Badge[];
}

// Mock user data as fallback
const mockUser: User = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  joinDate: '2023-01-15',
  points: 135,
  daysAttended: 42,
  referralCode: 'JANE2023',
  referrals: [
    { name: 'John Smith', date: '2023-02-10', status: 'active' },
    { name: 'Emily Wilson', date: '2023-03-05', status: 'active' }
  ],
  attendance: [
    { date: '2023-04-25', durationMinutes: 60, active: true },
    { date: '2023-04-23', durationMinutes: 75, active: true },
    { date: '2023-04-20', durationMinutes: 60, active: true },
    { date: '2023-04-18', durationMinutes: 90, active: true },
    { date: '2023-04-15', durationMinutes: 60, active: true }
  ],
  badges: [
    { name: '100 Days', earned: false, progress: 42 },
    { name: '200 Days', earned: false, progress: 42 },
    { name: '300 Days', earned: false, progress: 42 }
  ]
};

// Helper function to format dates
const formatDate = (dateString: string): string => {
  try {
    // First handle the case where dateString might be a MongoDB ISODate string
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateString}`);
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User>(mockUser);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAttending, setIsAttending] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use credentials: 'include' to send the auth cookie
        const response = await fetch('/api/user/me', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If there's an error fetching user data, we'll use the mock data
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Track attendance when user is active
  useEffect(() => {
    if (!isAttending) return;
    
    const timer = setInterval(() => {
      // Check if user is active (activity in the last minute)
      const now = Date.now();
      if (now - lastActivity < 60000) {
        setSessionTime(prev => prev + 1);
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [isAttending, lastActivity]);
  
  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
    };
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, []);
  
  const startAttendance = () => {
    setIsAttending(true);
    setSessionTime(0);
    setLastActivity(Date.now());
  };
  
  const endAttendance = async () => {
    setIsAttending(false);
    
    // Mark attendance in the backend
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          durationMinutes: sessionTime
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to record attendance');
      }
      
      // Refresh user data to show updated attendance
      const userData = await fetch('/api/user/me', {
        credentials: 'include'
      }).then(res => res.json());
      
      setUser(userData);
      
    } catch (error) {
      console.error('Error recording attendance:', error);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-700">Loading dashboard...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Add logout button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          {/* User Header */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}&apos;s Dashboard</h1>
                <p className="text-gray-600">Member since {formatDate(user.joinDate)}</p>
              </div>
              
              {isAttending ? (
                <div className="mt-4 md:mt-0 flex flex-col items-center">
                  <div className="text-lg font-semibold text-green-600 mb-2">
                    Session in progress: {Math.floor(sessionTime / 60)}h {sessionTime % 60}m
                  </div>
                  <button
                    onClick={endAttendance}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg"
                  >
                    End Session
                  </button>
                </div>
              ) : (
                <button
                  onClick={startAttendance}
                  className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Start Today&apos;s Session
                </button>
              )}
            </div>
          </div>
          
          {/* Dashboard Tabs */}
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'attendance'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Attendance History
              </button>
              <button
                onClick={() => setActiveTab('referrals')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'referrals'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Referrals
              </button>
              <button
                onClick={() => setActiveTab('rewards')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'rewards'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Rewards
              </button>
            </nav>
          </div>
          
          {/* Dashboard Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-700">Total Days Attended</h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{user.daysAttended || 0}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-700">Points Earned</h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">{user.points || 0}</p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-700">Referrals</h3>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{(user.referrals && user.referrals.length) || 0}</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-gray-700">Next Badge</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-xl font-bold text-yellow-600">{user.badges && user.badges[0] ? user.badges[0].name : 'Loading...'}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      {user.badges && user.badges[0] ? `(${user.badges[0].progress}/${user.badges[0].name.split(' ')[0]})` : ''}
                    </span>
                  </div>
                </div>
                
                <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {user.attendance && user.attendance.slice(0, 5).map((session, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap">{formatDate(session.date)}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{session.durationMinutes} minutes</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Completed
                              </span>
                            </td>
                          </tr>
                        ))}
                        
                        {user.attendance.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                              No attendance records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'attendance' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Attendance History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {user.attendance && user.attendance.map((session, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(session.date)}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{session.durationMinutes} minutes</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                      
                      {(!user.attendance || user.attendance.length === 0) && (
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                            No attendance records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'referrals' && (
              <div>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Referral Code</h3>
                  <div className="flex">
                    <input
                      type="text"
                      value={user.referralCode}
                      readOnly
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user.referralCode);
                        alert('Referral code copied to clipboard!');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Share this code with friends to earn 50 points for each successful referral!
                  </p>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Referrals</h3>
                {(!user.referrals || user.referrals.length === 0) ? (
                  <p className="text-gray-500">You haven&apos;t referred anyone yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {user.referrals.map((referral, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap">{referral.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{formatDate(referral.date)}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {referral.status === 'active' ? 'Active Member' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'rewards' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-6">Your Rewards</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h4 className="font-medium text-gray-800 mb-3">Points Summary</h4>
                    <p className="text-3xl font-bold text-blue-600 mb-4">{user.points} Points</p>
                    <div className="text-sm text-gray-600">
                      <p>• 1 point for each yoga session</p>
                      <p>• 50 points for each successful referral</p>
                      <p>• Unlock special rewards with your points</p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h4 className="font-medium text-gray-800 mb-3">Available Rewards</h4>
                    <ul className="space-y-3">
                      <li className="flex justify-between items-center">
                        <span>10% Merchandise Discount</span>
                        <button 
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            user.points >= 100 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={user.points < 100}
                        >
                          Redeem (100 pts)
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Free Private Session</span>
                        <button 
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            user.points >= 200 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={user.points < 200}
                        >
                          Redeem (200 pts)
                        </button>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Premium Yoga Mat</span>
                        <button 
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            user.points >= 300 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={user.points < 300}
                        >
                          Redeem (300 pts)
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-800 mb-4">Badges Progress</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {user.badges.map((badge, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium">{badge.name}</h5>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          badge.earned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {badge.earned ? 'Earned' : 'In Progress'}
                        </span>
                      </div>
                      
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              {Math.round((badge.progress / parseInt(badge.name)) * 100)}%
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              {badge.progress}/{badge.name.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                          <div 
                            style={{ width: `${(badge.progress / parseInt(badge.name)) * 100}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600">
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 