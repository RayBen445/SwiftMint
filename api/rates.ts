import { VercelRequest, VercelResponse } from '@vercel/node';

// Mock exchange rates with last update time
const EXCHANGE_RATES = {
  base: 'USD',
  lastUpdate: new Date().toISOString(),
  rates: {
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CAD: 1.36,
    AUD: 1.52,
    INR: 83.12,
    CHF: 0.88,
    CNY: 7.24,
    SGD: 1.34,
    HKD: 7.83,
    NZD: 1.67,
    SEK: 10.45,
    NOK: 10.87,
    DKK: 6.85,
    MXN: 17.12,
    BRL: 4.95,
    ZAR: 18.75,
  },
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base, currencies } = req.query;

    // If specific currencies requested
    if (currencies) {
      const requestedCurrencies = (currencies as string).split(',').map(c => c.toUpperCase());
      const filteredRates: Record<string, number> = {};

      requestedCurrencies.forEach(currency => {
        if (EXCHANGE_RATES.rates[currency as keyof typeof EXCHANGE_RATES.rates]) {
          filteredRates[currency] = EXCHANGE_RATES.rates[currency as keyof typeof EXCHANGE_RATES.rates];
        }
      });

      return res.status(200).json({
        success: true,
        base: (base as string)?.toUpperCase() || EXCHANGE_RATES.base,
        rates: filteredRates,
        lastUpdate: EXCHANGE_RATES.lastUpdate,
      });
    }

    // Return all rates
    return res.status(200).json({
      success: true,
      base: (base as string)?.toUpperCase() || EXCHANGE_RATES.base,
      rates: EXCHANGE_RATES.rates,
      lastUpdate: EXCHANGE_RATES.lastUpdate,
      disclaimer: 'These are mock rates for demonstration purposes only',
    });
  } catch (error) {
    console.error('Get rates error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
