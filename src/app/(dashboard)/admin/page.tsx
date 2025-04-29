'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '555-123-4567',
    age: 28,
    joinDate: '2023-01-15',
    points: 135,
    daysAttended: 42,
    referralCode: 'JANE2023',
    referrals: 2,
    lastActive: '2023-04-25'
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-987-6543',
    age: 34,
    joinDate: '2023-02-10',
    points: 78,
    daysAttended: 24,
    referralCode: 'JOHN2023',
    referrals: 1,
    lastActive: '2023-04-24'
  },
  {
    id: '3',
    name: 'Emily Wilson',
    email: 'emily.wilson@example.com',
    phone: '555-456-7890',
    age: 25,
    joinDate: '2023-03-05',
    points: 95,
    daysAttended: 31,
    referralCode: 'EMILY2023',
    referrals: 0,
    lastActive: '2023-04-20'
  },
  {
    id: '4',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    phone: '555-789-0123',
    age: 40,
    joinDate: '2023-01-20',
    points: 210,
    daysAttended: 65,
    referralCode: 'MIKE2023',
    referrals: 4,
    lastActive: '2023-04-25'
  },
  {
    id: '5',
    name: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    phone: '555-321-9876',
    age: 30,
    joinDate: '2023-02-28',
    points: 120,
    daysAttended: 36,
    referralCode: 'SARAH2023',
    referrals: 2,
    lastActive: '2023-04-22'
  }
];

// Mock activity data
const mockActivity = [
  { userId: '1', timestamp: '2023-04-25T10:15:00', action: 'Joined class', duration: 60 },
  { userId: '4', timestamp: '2023-04-25T10:15:00', action: 'Joined class', duration: 60 },
  { userId: '2', timestamp: '2023-04-24T17:30:00', action: 'Joined class', duration: 75 },
  { userId: '5', timestamp: '2023-04-22T09:00:00', action: 'Joined class', duration: 90 },
  { userId: '3', timestamp: '2023-04-20T18:45:00', action: 'Joined class', duration: 60 },
  { userId: '1', timestamp: '2023-04-18T10:15:00', action: 'Joined class', duration: 60 },
  { userId: '4', timestamp: '2023-04-18T10:15:00', action: 'Joined class', duration: 60 },
  { userId: '2', timestamp: '2023-04-17T17:30:00', action: 'Joined class', duration: 75 }
];

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers);
  const [activity, setActivity] = useState(mockActivity);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const router = useRouter();
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatDateTime = (dateTimeString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleUpdatePoints = (userId: string, amount: number) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, points: user.points + amount } 
          : user
      )
    );
    
    setShowUserModal(false);
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Logout button for admin */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm7 9a1 1 0 100-2H5a1 1 0 100 2h5zm-5-4a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          {/* Admin Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, track attendance, and handle rewards</p>
          </div>
          
          {/* Dashboard Tabs */}
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'activity'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Activity Log
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'statistics'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Statistics
              </button>
            </nav>
          </div>
          
          {/* Dashboard Content */}
          <div className="p-6">
            {activeTab === 'users' && (
              <div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-700 mb-3 md:mb-0">Manage Users</h2>
                  <div className="w-full md:w-64">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{formatDate(user.joinDate)}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.points}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{user.daysAttended}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-600">{formatDate(user.lastActive)}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <button 
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredUsers.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No users found matching the search term.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'activity' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-6">Recent Activity</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activity.map((entry, index) => {
                        const user = users.find(u => u.id === entry.userId);
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{formatDateTime(entry.timestamp)}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{entry.action}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{entry.duration} minutes</div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'statistics' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-6">Statistics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                    <p className="text-sm text-gray-500 mt-2">All registered users</p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Active Today</h3>
                    <p className="text-3xl font-bold text-green-600">
                      {users.filter(u => u.lastActive === '2023-04-25').length}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Users active today</p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Total Sessions</h3>
                    <p className="text-3xl font-bold text-purple-600">
                      {activity.length}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Total yoga sessions</p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Total Referrals</h3>
                    <p className="text-3xl font-bold text-yellow-600">
                      {users.reduce((sum, user) => sum + user.referrals, 0)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Across all users</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Top Users by Points</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Attended</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[...users]
                          .sort((a, b) => b.points - a.points)
                          .map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{user.points}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-600">{user.daysAttended}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-600">{user.referrals}</div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-xl w-full mx-4 overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-sm font-medium">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-sm font-medium">{selectedUser.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="text-sm font-medium">{formatDate(selectedUser.joinDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Days Attended</p>
                  <p className="text-sm font-medium">{selectedUser.daysAttended}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Active</p>
                  <p className="text-sm font-medium">{formatDate(selectedUser.lastActive)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Referral Code</p>
                  <p className="text-sm font-medium">{selectedUser.referralCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Referrals Made</p>
                  <p className="text-sm font-medium">{selectedUser.referrals}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Points Management</h4>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-blue-600 mr-6">{selectedUser.points} Points</p>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleUpdatePoints(selectedUser.id, 10)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Add 10
                    </button>
                    <button 
                      onClick={() => handleUpdatePoints(selectedUser.id, 50)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Add 50
                    </button>
                    <button 
                      onClick={() => handleUpdatePoints(selectedUser.id, -10)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      disabled={selectedUser.points < 10}
                    >
                      Remove 10
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg"
                >
                  Close
                </button>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 