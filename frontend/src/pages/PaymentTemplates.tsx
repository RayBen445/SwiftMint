import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

interface PaymentTemplate {
  id: string;
  name: string;
  category: 'bills' | 'rent' | 'subscriptions' | 'other';
  recipientWalletId: string;
  recipientName: string;
  amount: number;
  currency: string;
  note?: string;
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
}

const PaymentTemplates: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [templates, setTemplates] = useState<PaymentTemplate[]>([
    {
      id: 'TPL-001',
      name: 'Monthly Rent',
      category: 'rent',
      recipientWalletId: 'wallet_landlord123',
      recipientName: 'Property Management',
      amount: 1500,
      currency: 'USD',
      note: 'Monthly rent payment',
      usageCount: 12,
      lastUsed: new Date(2025, 10, 1),
      createdAt: new Date(2025, 0, 1),
    },
    {
      id: 'TPL-002',
      name: 'Netflix Subscription',
      category: 'subscriptions',
      recipientWalletId: 'wallet_netflix',
      recipientName: 'Netflix',
      amount: 15.99,
      currency: 'USD',
      note: 'Netflix Premium plan',
      usageCount: 8,
      lastUsed: new Date(2025, 9, 20),
      createdAt: new Date(2025, 2, 1),
    },
    {
      id: 'TPL-003',
      name: 'Electricity Bill',
      category: 'bills',
      recipientWalletId: 'wallet_utility',
      recipientName: 'City Power Company',
      amount: 85,
      currency: 'USD',
      note: 'Monthly electricity',
      usageCount: 10,
      lastUsed: new Date(2025, 10, 5),
      createdAt: new Date(2025, 1, 1),
    },
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'other' as const,
    recipientWalletId: '',
    amount: '',
    currency: 'USD',
    note: '',
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.recipientWalletId || !newTemplate.amount) {
      addNotification('Please fill in all required fields', 'error');
      return;
    }

    const template: PaymentTemplate = {
      id: `TPL-${Date.now()}`,
      name: newTemplate.name,
      category: newTemplate.category,
      recipientWalletId: newTemplate.recipientWalletId,
      recipientName: newTemplate.recipientWalletId, // In production, fetch from beneficiaries
      amount: parseFloat(newTemplate.amount),
      currency: newTemplate.currency,
      note: newTemplate.note,
      usageCount: 0,
      createdAt: new Date(),
    };

    setTemplates([...templates, template]);
    addNotification('Template created successfully!', 'success');
    setShowCreateModal(false);
    setNewTemplate({
      name: '',
      category: 'other',
      recipientWalletId: '',
      amount: '',
      currency: 'USD',
      note: '',
    });
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
    addNotification('Template deleted', 'success');
  };

  const useTemplate = (template: PaymentTemplate) => {
    // Navigate to send page with pre-filled data
    addNotification('Template applied! Complete the payment.', 'info');
    navigate(`/send?template=${template.id}`);
  };

  const filteredTemplates = templates.filter((t) =>
    selectedCategory === 'all' ? true : t.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    const icons = {
      bills: '📄',
      rent: '🏠',
      subscriptions: '📺',
      other: '💼',
    };
    return icons[category as keyof typeof icons] || '💼';
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      bills: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      rent: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      subscriptions: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return badges[category as keyof typeof badges] || badges.other;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment Templates</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Save time with frequently used payment configurations</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          + Create Template
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['all', 'bills', 'rent', 'subscriptions', 'other'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize flex items-center space-x-2 ${
              selectedCategory === category
                ? 'bg-sky-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category !== 'all' && <span>{getCategoryIcon(category)}</span>}
            <span>{category}</span>
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No templates in {selectedCategory === 'all' ? 'any category' : selectedCategory}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-sky-600 dark:text-sky-400 hover:underline"
          >
            Create your first template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getCategoryIcon(template.category)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{template.name}</h3>
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${getCategoryBadge(template.category)}`}>
                      {template.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-fuchsia-600 bg-clip-text text-transparent">
                  ${template.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{template.currency}</p>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start">
                  <span className="text-gray-600 dark:text-gray-400 text-sm mr-2">To:</span>
                  <span className="text-gray-900 dark:text-white text-sm font-medium break-all">
                    {template.recipientName}
                  </span>
                </div>
                {template.note && (
                  <div className="flex items-start">
                    <span className="text-gray-600 dark:text-gray-400 text-sm mr-2">Note:</span>
                    <span className="text-gray-900 dark:text-white text-sm italic">
                      {template.note}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-4">
                <span>Used {template.usageCount} times</span>
                {template.lastUsed && (
                  <span>
                    Last: {template.lastUsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => useTemplate(template)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 font-medium text-sm transition-all"
                >
                  Use Template
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 text-sm transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create New Template</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g., Monthly Rent"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="bills">📄 Bills</option>
                  <option value="rent">🏠 Rent</option>
                  <option value="subscriptions">📺 Subscriptions</option>
                  <option value="other">💼 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recipient Wallet ID *
                </label>
                <input
                  type="text"
                  value={newTemplate.recipientWalletId}
                  onChange={(e) => setNewTemplate({ ...newTemplate, recipientWalletId: e.target.value })}
                  placeholder="wallet_abc123"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={newTemplate.amount}
                    onChange={(e) => setNewTemplate({ ...newTemplate, amount: e.target.value })}
                    placeholder="100.00"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={newTemplate.currency}
                    onChange={(e) => setNewTemplate({ ...newTemplate, currency: e.target.value })}
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
                  Note (Optional)
                </label>
                <textarea
                  value={newTemplate.note}
                  onChange={(e) => setNewTemplate({ ...newTemplate, note: e.target.value })}
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
                onClick={handleCreateTemplate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 font-medium"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTemplates;
