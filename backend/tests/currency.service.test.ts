import { currencyService } from '../src/services/currency.service';

describe('CurrencyService', () => {
  describe('getExchangeRates', () => {
    it('should return exchange rates for USD base', async () => {
      const rates = await currencyService.getExchangeRates('USD');
      
      expect(rates).toBeDefined();
      expect(rates.USD).toBe(1.0);
      expect(rates.EUR).toBeGreaterThan(0);
      expect(rates.GBP).toBeGreaterThan(0);
    });

    it('should return exchange rates for EUR base', async () => {
      const rates = await currencyService.getExchangeRates('EUR');
      
      expect(rates).toBeDefined();
      expect(rates.EUR).toBe(1.0);
      expect(rates.USD).toBeGreaterThan(0);
    });
  });

  describe('convert', () => {
    it('should convert USD to EUR correctly', async () => {
      const amount = 100;
      const result = await currencyService.convert(amount, 'USD', 'EUR');
      
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(amount); // EUR should be less than USD
    });

    it('should convert currency to itself returning same amount', async () => {
      const amount = 100;
      const result = await currencyService.convert(amount, 'USD', 'USD');
      
      expect(result).toBe(amount);
    });
  });

  describe('getSupportedCurrencies', () => {
    it('should return a list of supported currencies', () => {
      const currencies = currencyService.getSupportedCurrencies();
      
      expect(currencies).toBeDefined();
      expect(currencies.length).toBeGreaterThan(0);
      expect(currencies).toContain('USD');
      expect(currencies).toContain('EUR');
    });
  });

  describe('getOptimalRate', () => {
    it('should return an optimal rate that is better than base rate', async () => {
      const rates = await currencyService.getExchangeRates('USD');
      const baseRate = rates.EUR;
      const optimalRate = await currencyService.getOptimalRate('USD', 'EUR');
      
      expect(optimalRate).toBeGreaterThan(baseRate);
    });
  });
});
