import React, { useState } from 'react';
import CurrencySelector from '../components/CurrencySelector';
import { requestMoney } from '../utils/api';

const Request: React.FC = () => {
  const [formData, setFormData] = useState({
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
      const response = await requestMoney({
        walletId: 'wallet_user123',
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        note: formData.note,
      });

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment request');
    } finally {
      setLoading(false);
    }
  };

  const handleNewRequest = () => {
    setResult(null);
    setFormData({ amount: '', currency: 'USD', note: '' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Payment</h1>
        <p className="text-gray-600">Create a payment request and share it with anyone</p>
      </div>

      {!result ? (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="50.00"
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
                placeholder="What's this payment for?"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Payment Request'}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card bg-green-50 border-2 border-green-200">
            <div className="text-center space-y-4">
              <div className="text-6xl">✅</div>
              <h2 className="text-2xl font-bold text-green-900">Payment Request Created!</h2>
              
              <div className="p-4 bg-white rounded-lg">
                <img 
                  src={result.paymentRequest.qrCode} 
                  alt="QR Code" 
                  className="mx-auto w-48 h-48"
                />
              </div>

              <div className="text-left space-y-3 bg-white p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Request ID</p>
                  <p className="font-mono text-sm">{result.paymentRequest.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    {result.paymentRequest.currency} {result.paymentRequest.amount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Link</p>
                  <a 
                    href={result.paymentRequest.paymentLink} 
                    className="text-primary-600 hover:underline text-sm break-all"
                  >
                    {result.paymentRequest.paymentLink}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expires</p>
                  <p className="text-sm">{new Date(result.paymentRequest.expiresAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 btn-primary">
                  Share Link
                </button>
                <button className="flex-1 btn-secondary">
                  Download QR
                </button>
              </div>

              <button onClick={handleNewRequest} className="text-primary-600 hover:underline text-sm">
                Create Another Request
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card bg-purple-50 border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-2">💡 How it works</h3>
        <ul className="text-sm text-purple-800 space-y-1 list-disc list-inside">
          <li>Create a payment request with the amount you want to receive</li>
          <li>Share the QR code or payment link with anyone</li>
          <li>They can scan or click to pay you instantly</li>
          <li>Request expires after 24 hours for security</li>
        </ul>
      </div>
    </div>
  );
};

export default Request;
