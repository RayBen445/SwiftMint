import { useState } from 'react';
import CurrencySelector from '../components/CurrencySelector';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export default function SendMoneyPage() {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    amount: '',
    currency: 'USD',
    note: '',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: formData.recipientEmail,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setFormData({ recipientEmail: '', amount: '', currency: 'USD', note: '' });
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Send failed:', error);
    } finally {
      setSending(false);
    }
  };

  const fee = formData.amount ? Math.max(parseFloat(formData.amount) * 0.001, 0.01) : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Money</h1>
        <p className="text-gray-600">Transfer money to anyone, anywhere in seconds</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            Payment sent successfully! 🎉
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email
            </label>
            <input
              type="email"
              value={formData.recipientEmail}
              onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="recipient@example.com"
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
              Note (Optional)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="What's this for?"
            />
          </div>

          {formData.amount && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transfer Amount</span>
                <span className="font-medium">{formData.amount} {formData.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fee (0.1%)</span>
                <span className="font-medium">{fee.toFixed(2)} {formData.currency}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-lg">
                  {(parseFloat(formData.amount) + fee).toFixed(2)} {formData.currency}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
          >
            {sending ? 'Sending...' : 'Send Money'}
          </button>
        </form>
      </div>
    </div>
  );
}
