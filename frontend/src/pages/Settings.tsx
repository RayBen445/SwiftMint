import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'privacy'>('general');

  const [settings, setSettings] = useState({
    // General
    language: 'en',
    currency: 'USD',
    timezone: 'auto',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    paymentAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    
    // Security
    twoFactorAuth: false,
    biometricLogin: false,
    sessionTimeout: '30',
    
    // Privacy
    showProfile: true,
    showTransactions: false,
    dataSharing: false,
  });

  const handleChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Manage your account preferences and settings
      </p>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {(['general', 'security', 'notifications', 'privacy'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  General Settings
                </h3>
                
                {/* Theme Toggle */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    style={{ backgroundColor: theme === 'dark' ? '#0EA5E9' : '#E5E7EB' }}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Language */}
                <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                  <label className="block">
                    <span className="font-medium text-gray-900 dark:text-white">Language</span>
                    <select
                      value={settings.language}
                      onChange={(e) => handleChange('language', e.target.value)}
                      className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                      <option value="ja">日本語</option>
                    </select>
                  </label>
                </div>

                {/* Default Currency */}
                <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                  <label className="block">
                    <span className="font-medium text-gray-900 dark:text-white">Default Currency</span>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                      className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="USD">USD - US Dollar ($)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                      <option value="JPY">JPY - Japanese Yen (¥)</option>
                      <option value="CAD">CAD - Canadian Dollar ($)</option>
                    </select>
                  </label>
                </div>

                {/* Timezone */}
                <div className="py-4">
                  <label className="block">
                    <span className="font-medium text-gray-900 dark:text-white">Timezone</span>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleChange('timezone', e.target.value)}
                      className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Security Settings
                </h3>

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button
                    onClick={() => handleChange('twoFactorAuth', !settings.twoFactorAuth)}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    style={{ backgroundColor: settings.twoFactorAuth ? '#0EA5E9' : '#E5E7EB' }}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Biometric Login */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Biometric Login</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Use fingerprint or face recognition
                    </p>
                  </div>
                  <button
                    onClick={() => handleChange('biometricLogin', !settings.biometricLogin)}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    style={{ backgroundColor: settings.biometricLogin ? '#0EA5E9' : '#E5E7EB' }}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        settings.biometricLogin ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Session Timeout */}
                <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                  <label className="block">
                    <span className="font-medium text-gray-900 dark:text-white">Session Timeout</span>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                      className="mt-2 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="never">Never</option>
                    </select>
                  </label>
                </div>

                {/* Change Password */}
                <div className="py-4">
                  <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notification Preferences
                </h3>

                {/* Email Notifications */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications via email
                    </p>
                  </div>
                  <button
                    onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    style={{ backgroundColor: settings.emailNotifications ? '#0EA5E9' : '#E5E7EB' }}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get real-time updates on your device
                    </p>
                  </div>
                  <button
                    onClick={() => handleChange('pushNotifications', !settings.pushNotifications)}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    style={{ backgroundColor: settings.pushNotifications ? '#0EA5E9' : '#E5E7EB' }}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Payment Alerts */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Payment Alerts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Notifications for transactions
                    </p>
                  </div>
                  <button
                    onClick={() => handleChange('paymentAlerts', !settings.paymentAlerts)}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    style={{ backgroundColor: settings.paymentAlerts ? '#0EA5E9' : '#E5E7EB' }}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        settings.paymentAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Security Alerts */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Security Alerts</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Important security notifications
                    </p>
                  </div>
                  <button
                    onClick={() => handleChange('securityAlerts', !settings.securityAlerts)}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    style={{ backgroundColor: settings.securityAlerts ? '#0EA5E9' : '#E5E7EB' }}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        settings.securityAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Marketing Emails</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Promotional offers and updates
                    </p>
                  </div>
                  <button
                    onClick={() => handleChange('marketingEmails', !settings.marketingEmails)}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    style={{ backgroundColor: settings.marketingEmails ? '#0EA5E9' : '#E5E7EB' }}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        settings.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Privacy Settings
                </h3>

                {/* Show Profile */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Public Profile</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Allow others to find you
                    </p>
                  </div>
                  <button
                    onClick={() => handleChange('showProfile', !settings.showProfile)}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    style={{ backgroundColor: settings.showProfile ? '#0EA5E9' : '#E5E7EB' }}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        settings.showProfile ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Show Transactions */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Transaction History</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Make transaction history public
                    </p>
                  </div>
                  <button
                    onClick={() => handleChange('showTransactions', !settings.showTransactions)}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    style={{ backgroundColor: settings.showTransactions ? '#0EA5E9' : '#E5E7EB' }}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        settings.showTransactions ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Data Sharing */}
                <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Data Sharing</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Share usage data for analytics
                    </p>
                  </div>
                  <button
                    onClick={() => handleChange('dataSharing', !settings.dataSharing)}
                    className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    style={{ backgroundColor: settings.dataSharing ? '#0EA5E9' : '#E5E7EB' }}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        settings.dataSharing ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Download Data */}
                <div className="py-4">
                  <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors mr-4">
                    Download My Data
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
