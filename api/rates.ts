import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock exchange rates (base: USD)
const mockExchangeRates: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  CNY: 7.24,
};

function calculateRates(baseCurrency: string): Record<string, number> {
  const baseRate = mockExchangeRates[baseCurrency] || 1;
  const rates: Record<string, number> = {};

  for (const [currency, rate] of Object.entries(mockExchangeRates)) {
    rates[currency] = parseFloat((rate / baseRate).toFixed(6));
  }

  return rates;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const base = (req.query.base as string) || 'USD';
  const rates = calculateRates(base.toUpperCase());

  res.status(200).json({
    success: true,
    base,
    rates,
    timestamp: new Date().toISOString(),
  });
}
