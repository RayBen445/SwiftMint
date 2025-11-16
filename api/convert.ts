import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ConvertRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  userId?: string;
}

// Mock exchange rates (base: USD)
const exchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  CNY: 7.24,
};

function convertCurrency(amount: number, from: string, to: string): number {
  const fromRate = exchangeRates[from] || 1;
  const toRate = exchangeRates[to] || 1;
  return (amount / fromRate) * toRate;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, fromCurrency, toCurrency, userId } = req.body as ConvertRequest;

  if (!amount || !fromCurrency || !toCurrency) {
    return res.status(400).json({
      error: 'Amount, from currency, and to currency are required',
    });
  }

  const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
  const rate = convertedAmount / amount;

  // Mock transaction response
  const transaction = {
    id: `txn_${Date.now()}`,
    userId: userId || 'mock-user-id',
    type: 'convert',
    amount,
    fromCurrency,
    toCurrency,
    convertedAmount: parseFloat(convertedAmount.toFixed(2)),
    exchangeRate: parseFloat(rate.toFixed(6)),
    status: 'completed',
    fee: Math.max(amount * 0.001, 0.01),
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };

  res.status(201).json({
    success: true,
    transaction,
  });
}
