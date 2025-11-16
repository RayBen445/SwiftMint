import { useState, useEffect } from 'react';
import CurrencySelector from '../components/CurrencySelector';

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export default function ConvertCurrencyPage() {
  const [formData, setFormData] = useState({
    amount: '',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
  });
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [converting, setConverting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (formData.amount && parseFloat(formData.amount) > 0) {
      const fetchRate = async () => {
        try {
          const response = await fetch(
            `/api/rates?base=${formData.fromCurrency}`
          );
          const data = await response.json();
          const rate = data.rates[formData.toCurrency];
          setExchangeRate(rate);
          setConvertedAmount(parseFloat(formData.amount) * rate);
        } catch (error) {
          console.error('Failed to fetch rates:', error);
        }
      };
      fetchRate();
    } else {
      setConvertedAmount(null);
      setExchangeRate(null);
    }
  }, [formData.amount, formData.fromCurrency, formData.toCurrency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConverting(true);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          fromCurrency: formData.fromCurrency,
          toCurrency: formData.toCurrency,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setFormData({ amount: '', fromCurrency: 'USD', toCurrency: 'EUR' });
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setConverting(false);
    }
  };

  const swapCurrencies = () => {
    setFormData({
      ...formData,
      fromCurrency: formData.toCurrency,
      toCurrency: formData.fromCurrency,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Convert Currency</h1>
        <p className="text-gray-600">Exchange currencies at the best rates</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            Currency converted successfully! 🎉
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-2xl font-semibold"
              placeholder="0.00"
              required
            />
          </div>

          <div className="relative">
            <CurrencySelector
              label="From"
              value={formData.fromCurrency}
              onChange={(currency) => setFormData({ ...formData, fromCurrency: currency })}
              currencies={currencies}
            />

            <button
              type="button"
              onClick={swapCurrencies}
              className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-300 rounded-full p-2 hover:bg-gray-50 transition"
              style={{ top: '100%' }}
            >
              🔄
            </button>

            <div className="mt-8">
              <CurrencySelector
                label="To"
                value={formData.toCurrency}
                onChange={(currency) => setFormData({ ...formData, toCurrency: currency })}
                currencies={currencies}
              />
            </div>
          </div>

          {convertedAmount !== null && exchangeRate !== null && (
            <div className="bg-primary-50 rounded-lg p-4 space-y-2">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">You will receive</p>
                <p className="text-3xl font-bold text-primary-700">
                  {convertedAmount.toFixed(2)} {formData.toCurrency}
                </p>
              </div>
              <div className="border-t border-primary-200 pt-2 text-center text-sm text-gray-600">
                1 {formData.fromCurrency} = {exchangeRate.toFixed(4)} {formData.toCurrency}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={converting || !convertedAmount}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
          >
            {converting ? 'Converting...' : 'Convert Currency'}
          </button>
        </form>
      </div>
    </div>
  );
}
