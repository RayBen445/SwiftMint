import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  icon: string;
  color: string;
}

const Budget: React.FC = () => {
  const { addNotification } = useNotifications();
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', category: 'Food & Dining', amount: 300, spent: 280, icon: '🍔', color: 'bg-blue-500' },
    { id: '2', category: 'Transport', amount: 200, spent: 180, icon: '🚗', color: 'bg-purple-500' },
    { id: '3', category: 'Entertainment', amount: 150, spent: 140, icon: '🎬', color: 'bg-green-500' },
    { id: '4', category: 'Shopping', amount: 250, spent: 120, icon: '🛍️', color: 'bg-orange-500' },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
  });

  const categories = [
    { name: 'Food & Dining', icon: '🍔', color: 'bg-blue-500' },
    { name: 'Transport', icon: '🚗', color: 'bg-purple-500' },
    { name: 'Entertainment', icon: '🎬', color: 'bg-green-500' },
    { name: 'Shopping', icon: '🛍️', color: 'bg-orange-500' },
    { name: 'Bills', icon: '📄', color: 'bg-red-500' },
    { name: 'Other', icon: '💼', color: 'bg-gray-500' },
  ];

  const handleCreateBudget = () => {
    if (!newBudget.category || !newBudget.amount) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Please fill in all fields',
      });
      return;
    }

    const selectedCategory = categories.find(c => c.name === newBudget.category);
    if (!selectedCategory) return;

    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      amount: parseFloat(newBudget.amount),
      spent: 0,
      icon: selectedCategory.icon,
      color: selectedCategory.color,
    };

    setBudgets([...budgets, budget]);
    setNewBudget({ category: '', amount: '' });
    setShowCreateModal(false);

    addNotification({
      type: 'success',
      title: 'Success',
      message: `Budget created for ${budget.category}`,
    });
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Budget deleted',
    });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressText = (percentage: number) => {
    if (percentage >= 100) return 'Over budget';
    if (percentage >= 80) return 'Near limit';
    return 'On track';
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Budget Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Track and manage your spending budgets</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            + Create Budget
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Budget</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              ${totalBudget.toFixed(2)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Remaining</p>
            <p className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(remaining).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.amount) * 100;
            return (
              <div key={budget.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${budget.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                      {budget.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBudget(budget.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    🗑️
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{percentage.toFixed(1)}% used</span>
                    <span className={`font-medium ${percentage >= 100 ? 'text-red-600' : percentage >= 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {getProgressText(percentage)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {percentage >= 100 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      ⚠️ You've exceeded this budget by ${(budget.spent - budget.amount).toFixed(2)}
                    </p>
                  </div>
                )}
                {percentage >= 80 && percentage < 100 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ You're close to your limit. ${(budget.amount - budget.spent).toFixed(2)} remaining
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Create Budget Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create Budget</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Budget Amount
                  </label>
                  <input
                    type="number"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateBudget}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Create Budget
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
