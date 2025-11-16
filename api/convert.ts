import { VercelRequest, VercelResponse } from '@vercel/node';

interface ConvertRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

// Mock exchange rates (would normally come from a real API)
const EXCHANGE_RATES: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, GBP: 0.79, JPY: 149.50, CAD: 1.36, AUD: 1.52, INR: 83.12 },
  EUR: { USD: 1.09, GBP: 0.86, JPY: 162.50, CAD: 1.48, AUD: 1.65, INR: 90.45 },
  GBP: { USD: 1.27, EUR: 1.16, JPY: 189.20, CAD: 1.72, AUD: 1.92, INR: 105.30 },
  JPY: { USD: 0.0067, EUR: 0.0062, GBP: 0.0053, CAD: 0.0091, AUD: 0.0102, INR: 0.56 },
  CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 109.93, AUD: 1.12, INR: 61.12 },
  AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 98.36, CAD: 0.89, INR: 54.68 },
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.79, CAD: 0.016, AUD: 0.018 },
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fromCurrency, toCurrency, amount }: ConvertRequest = req.body;

    if (!fromCurrency || !toCurrency || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: fromCurrency, toCurrency, amount' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    const upperFrom = fromCurrency.toUpperCase();
    const upperTo = toCurrency.toUpperCase();

    if (upperFrom === upperTo) {
      return res.status(200).json({
        success: true,
        conversion: {
          fromCurrency: upperFrom,
          toCurrency: upperTo,
          fromAmount: amount,
          toAmount: amount,
          rate: 1,
          fee: 0,
          timestamp: new Date().toISOString(),
        },
      });
    }

    if (!EXCHANGE_RATES[upperFrom] || !EXCHANGE_RATES[upperFrom][upperTo]) {
      return res.status(400).json({ 
        error: `Exchange rate not available for ${upperFrom} to ${upperTo}` 
      });
    }

    const rate = EXCHANGE_RATES[upperFrom][upperTo];
    const convertedAmount = amount * rate;
    const fee = convertedAmount * 0.002; // 0.2% conversion fee
    const finalAmount = convertedAmount - fee;

    return res.status(200).json({
      success: true,
      conversion: {
        fromCurrency: upperFrom,
        toCurrency: upperTo,
        fromAmount: amount,
        toAmount: parseFloat(finalAmount.toFixed(2)),
        rate: parseFloat(rate.toFixed(6)),
        fee: parseFloat(fee.toFixed(2)),
        timestamp: new Date().toISOString(),
      },
      message: 'Conversion calculated successfully',
    });
  } catch (error) {
    console.error('Currency conversion error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
