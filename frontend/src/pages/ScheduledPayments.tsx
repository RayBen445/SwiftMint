import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

interface ScheduledPayment {
  id: string;
  recipientWalletId: string;
  recipientName: string;
  amount: number;
  currency: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDate: Date;
  endDate?: Date;
  note?: string;
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  createdAt: Date;
}

const ScheduledPayments: React.FC = () => {
  const { addNotification } = useNotifications();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('active');

  // Mock scheduled payments
  const [scheduledPayments, setScheduledPayments] = useState<ScheduledPayment[]>([
    {
      id: 'SCH-001',
      recipientWalletId: 'wallet_rent',
      recipientName: 'Landlord',
      amount: 1500,
      currency: 'USD',
      frequency: 'monthly',
      nextDate: new Date(2025, 11, 1),
      note: 'Monthly rent payment',
      status: 'active',
      createdAt: new Date(2025, 0, 1),
    },
    {
      id: 'SCH-002',
      recipientWalletId: 'wallet_subscription',
      recipientName: 'Netflix',
      amount: 15.99,
      currency: 'USD',
      frequency: 'monthly',
      nextDate: new Date(2025, 10, 20),
      status: 'active',
      createdAt: new Date(2025, 0, 15),
    },
  ]);

  const [newPayment, setNewPayment] = useState({
    recipientWalletId: '',
    amount: '',
    currency: 'USD',
    frequency: 'once' as const,
    date: '',
    time: '',
    note: '',
  });

  const handleCreatePayment = () => {
    if (!newPayment.recipientWalletId || !newPayment.amount || !newPayment.date) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
      });
      return;
    }

    const scheduledDate = new Date(`${newPayment.date}T${newPayment.time || '12:00'}`);
    
    const payment: ScheduledPayment = {
      id: `SCH-${Date.now()}`,
      recipientWalletId: newPayment.recipientWalletId,
      recipientName: newPayment.recipientWalletId, // In production, fetch from beneficiaries
      amount: parseFloat(newPayment.amount),
      currency: newPayment.currency,
      frequency: newPayment.frequency,
      nextDate: scheduledDate,
      note: newPayment.note,
      status: 'active',
      createdAt: new Date(),
    };

    setScheduledPayments([...scheduledPayments, payment]);
    addNotification({
      type: 'success',
      title: 'Payment Scheduled',
      message: 'Scheduled payment created successfully!',
    });
    setShowCreateModal(false);
    setNewPayment({
      recipientWalletId: '',
      amount: '',
      currency: 'USD',
      frequency: 'once',
      date: '',
      time: '',
      note: '',
    });
  };

  const cancelPayment = (id: string) => {
    setScheduledPayments(
      scheduledPayments.map((p) =>
        p.id === id ? { ...p, status: 'cancelled' as const } : p
      )
    );
    addNotification({
      type: 'success',
      title: 'Payment Cancelled',
      message: 'Scheduled payment cancelled successfully',
    });
  };

  const pausePayment = (id: string) => {
    const payment = scheduledPayments.find(p => p.id === id);
    const isPaused = payment?.status === 'paused';
    setScheduledPayments(
      scheduledPayments.map((p) =>
        p.id === id ? { ...p, status: isPaused ? 'active' as const : 'paused' as const } : p
      )
    );
    addNotification({
      type: 'success',
      title: isPaused ? 'Payment Resumed' : 'Payment Paused',
      message: `Payment ${isPaused ? 'resumed' : 'paused'} successfully`,
    });
  };

  const filteredPayments = scheduledPayments.filter((p) =>
    filterStatus === 'all' ? true : p.status === filterStatus
  );

  const getFrequencyBadge = (frequency: string) => {
    const badges = {
      once: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      daily: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      weekly: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      monthly: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      yearly: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return badges[frequency as keyof typeof badges] || badges.once;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scheduled Payments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your recurring and scheduled transactions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          + Schedule Payment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['all', 'active', 'paused', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              filterStatus === status
                ? 'bg-sky-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Scheduled Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No {filterStatus} scheduled payments</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-sky-600 dark:text-sky-400 hover:underline"
            >
              Create your first scheduled payment
            </button>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {payment.recipientName}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getFrequencyBadge(payment.frequency)}`}>
                      {payment.frequency}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    To: <span className="font-mono">{payment.recipientWalletId}</span>
                  </p>
                  {payment.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      Note: {payment.note}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{payment.currency}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Next payment:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {payment.nextDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">ID:</span>
                    <span className="ml-2 font-mono text-xs text-gray-900 dark:text-white">
                      {payment.id}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {payment.status === 'active' && (
                    <>
                      <button
                        onClick={() => pausePayment(payment.id)}
                        className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800"
                      >
                        ⏸️ Pause
                      </button>
                      <button
                        onClick={() => cancelPayment(payment.id)}
                        className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
                      >
                        ❌ Cancel
                      </button>
                    </>
                  )}
                  {payment.status === 'paused' && (
                    <button
                      onClick={() => pausePayment(payment.id)}
                      className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800"
                    >
                      ▶️ Resume
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Payment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Schedule New Payment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recipient Wallet ID
                </label>
                <input
                  type="text"
                  value={newPayment.recipientWalletId}
                  onChange={(e) => setNewPayment({ ...newPayment, recipientWalletId: e.target.value })}
                  placeholder="wallet_abc123"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    placeholder="100.00"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={newPayment.currency}
                    onChange={(e) => setNewPayment({ ...newPayment, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Frequency
                </label>
                <select
                  value={newPayment.frequency}
                  onChange={(e) => setNewPayment({ ...newPayment, frequency: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="once">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={newPayment.time}
                    onChange={(e) => setNewPayment({ ...newPayment, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Note (Optional)
                </label>
                <textarea
                  value={newPayment.note}
                  onChange={(e) => setNewPayment({ ...newPayment, note: e.target.value })}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePayment}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 font-medium"
              >
                Schedule Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledPayments;
