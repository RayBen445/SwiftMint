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

export class CurrencyService {
  async getExchangeRates(baseCurrency: string = 'USD'): Promise<Record<string, number>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Recalculate rates based on the base currency
    const baseRate = mockExchangeRates[baseCurrency] || 1;
    const rates: Record<string, number> = {};

    for (const [currency, rate] of Object.entries(mockExchangeRates)) {
      rates[currency] = rate / baseRate;
    }

    return rates;
  }

  async convert(amount: number, from: string, to: string): Promise<number> {
    const rates = await this.getExchangeRates(from);
    const rate = rates[to] || 1;
    return amount * rate;
  }

  async getOptimalRate(from: string, to: string): Promise<number> {
    // Mock rate optimizer - in production, this would compare multiple providers
    const rates = await this.getExchangeRates(from);
    const baseRate = rates[to] || 1;
    
    // Simulate 0.5% better rate from optimizer
    return baseRate * 1.005;
  }

  getSupportedCurrencies(): string[] {
    return Object.keys(mockExchangeRates);
  }

  async getHistoricalRates(
    from: string,
    to: string,
    days: number = 30
  ): Promise<Array<{ date: string; rate: number }>> {
    const rates = await this.getExchangeRates(from);
    const currentRate = rates[to] || 1;
    const history = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      // Add some random variation for mock data
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      history.push({
        date: date.toISOString().split('T')[0],
        rate: currentRate * (1 + variation),
      });
    }

    return history;
  }
}

export const currencyService = new CurrencyService();
