import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'notifications'>('info');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="card">
        <div className="flex items-center space-x-4 pb-6 border-b">
          <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">Wallet ID: {user.walletId}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'info'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'security'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'notifications'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Notifications
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={user.phone || 'Not provided'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wallet ID</label>
                  <input
                    type="text"
                    value={user.walletId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <button className="btn-primary">Edit Profile</button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <button className="btn-secondary">Enable</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-gray-600">Update your password regularly</p>
                      </div>
                      <button className="btn-secondary">Change</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Login Activity</p>
                        <p className="text-sm text-gray-600">View recent login sessions</p>
                      </div>
                      <button className="btn-secondary">View</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email Notifications', description: 'Receive transaction updates via email' },
                    { id: 'push', label: 'Push Notifications', description: 'Get instant alerts on your device' },
                    { id: 'sms', label: 'SMS Notifications', description: 'Receive text messages for important updates' },
                    { id: 'marketing', label: 'Marketing Emails', description: 'Get updates about new features and offers' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <button
            onClick={handleLogout}
            className="btn-secondary bg-red-50 text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
