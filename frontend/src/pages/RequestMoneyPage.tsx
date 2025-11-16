import { useState } from 'react';
import CurrencySelector from '../components/CurrencySelector';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export default function RequestMoneyPage() {
  const [formData, setFormData] = useState({
    fromEmail: '',
    amount: '',
    currency: 'USD',
    reason: '',
  });
  const [requesting, setRequesting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);

    // Mock request - in production, this would call the API
    setTimeout(() => {
      setSuccess(true);
      setRequesting(false);
      setTimeout(() => {
        setFormData({ fromEmail: '', amount: '', currency: 'USD', reason: '' });
        setSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Money</h1>
        <p className="text-gray-600">Request payment from anyone via email</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            Payment request sent successfully! 💸
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Request From (Email)
            </label>
            <input
              type="email"
              value={formData.fromEmail}
              onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="payer@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          <CurrencySelector
            label="Currency"
            value={formData.currency}
            onChange={(currency) => setFormData({ ...formData, currency })}
            currencies={currencies}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Request
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="What is this payment for?"
              required
            />
          </div>

          <button
            type="submit"
            disabled={requesting}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
          >
            {requesting ? 'Sending Request...' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
