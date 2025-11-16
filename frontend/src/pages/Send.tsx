import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CurrencySelector from '../components/CurrencySelector';
import { sendMoney } from '../utils/api';

const Send: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    toWallet: '',
    amount: '',
    currency: 'USD',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await sendMoney({
        fromWallet: 'wallet_user123',
        toWallet: formData.toWallet,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        note: formData.note,
      });

      setResult(response);
      
      // Store transaction data in localStorage and redirect to receipt
      localStorage.setItem('lastTransaction', JSON.stringify(response.transaction));
      
      // Show success briefly then redirect
      setTimeout(() => {
        navigate('/receipt');
      }, 1500);
      
      setFormData({ toWallet: '', amount: '', currency: 'USD', note: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Money</h1>
        <p className="text-gray-600">Send instant payments globally with ultra-low fees</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Wallet ID
            </label>
            <input
              type="text"
              value={formData.toWallet}
              onChange={(e) => setFormData({ ...formData, toWallet: e.target.value })}
              placeholder="wallet_abc123"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                placeholder="100.00"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <CurrencySelector
              value={formData.currency}
              onChange={(currency) => setFormData({ ...formData, currency })}
              label="Currency"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Add a note to your payment"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold mb-2">✅ Transaction Successful!</p>
              <div className="text-sm text-green-700 space-y-1">
                <p>Transaction ID: {result.transaction.id}</p>
                <p>Amount: {result.transaction.currency} {result.transaction.amount}</p>
                <p>Fee: {result.transaction.currency} {result.transaction.fee.toFixed(2)}</p>
                <p>Status: {result.transaction.status}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Send Money'}
          </button>
        </form>
      </div>

      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Fee Information</h3>
        <p className="text-sm text-blue-800">
          SwiftMint charges a flat 0.1% fee on all transactions. Send $100, pay just $0.10 in fees!
        </p>
      </div>
    </div>
  );
};

export default Send;
