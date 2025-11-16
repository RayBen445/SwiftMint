import React, { useState, useEffect } from 'react';
import CurrencySelector from '../components/CurrencySelector';
import { convertCurrency, getExchangeRates } from '../utils/api';

const Convert: React.FC = () => {
  const [formData, setFormData] = useState({
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<any>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await getExchangeRates();
        setRates(response);
      } catch (err) {
        console.error('Failed to fetch rates:', err);
      }
    };

    fetchRates();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await convertCurrency({
        fromCurrency: formData.fromCurrency,
        toCurrency: formData.toCurrency,
        amount: parseFloat(formData.amount),
      });

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert currency');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFormData({
      ...formData,
      fromCurrency: formData.toCurrency,
      toCurrency: formData.fromCurrency,
    });
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Convert Currency</h1>
        <p className="text-gray-600">Exchange between currencies at competitive rates</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Convert
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

          <div className="space-y-4">
            <CurrencySelector
              value={formData.fromCurrency}
              onChange={(currency) => setFormData({ ...formData, fromCurrency: currency })}
              label="From Currency"
            />

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSwapCurrencies}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="text-2xl">⇅</span>
              </button>
            </div>

            <CurrencySelector
              value={formData.toCurrency}
              onChange={(currency) => setFormData({ ...formData, toCurrency: currency })}
              label="To Currency"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {result && (
            <div className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-200 rounded-lg">
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-600">You'll receive</p>
                  <p className="text-4xl font-bold text-primary-700">
                    {result.conversion.toCurrency} {result.conversion.toAmount}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded">
                    <p className="text-gray-600">Exchange Rate</p>
                    <p className="font-semibold">1 {result.conversion.fromCurrency} = {result.conversion.rate} {result.conversion.toCurrency}</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-gray-600">Conversion Fee</p>
                    <p className="font-semibold">{result.conversion.toCurrency} {result.conversion.fee}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Converting...' : 'Convert Currency'}
          </button>
        </form>
      </div>

      {rates && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Current Exchange Rates (Base: {rates.base})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(rates.rates).slice(0, 9).map(([currency, rate]) => (
              <div key={currency} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{currency}</p>
                <p className="font-semibold">{typeof rate === 'number' ? rate.toFixed(4) : String(rate)}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Last updated: {new Date(rates.lastUpdate).toLocaleString()}
          </p>
        </div>
      )}

      <div className="card bg-indigo-50 border border-indigo-200">
        <h3 className="font-semibold text-indigo-900 mb-2">💡 Conversion Info</h3>
        <p className="text-sm text-indigo-800">
          SwiftMint uses real-time exchange rates with a transparent 0.2% conversion fee. 
          No hidden charges, what you see is what you get!
        </p>
      </div>
    </div>
  );
};

export default Convert;
