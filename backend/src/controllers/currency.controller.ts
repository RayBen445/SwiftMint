import { Request, Response } from 'express';
import { currencyService } from '../services/currency.service';
import { supportedCurrencies } from '../models/wallet.model';

export class CurrencyController {
  async getRates(req: Request, res: Response) {
    try {
      const { base = 'USD' } = req.query;
      const rates = await currencyService.getExchangeRates(base as string);

      res.json({
        base,
        rates,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exchange rates' });
    }
  }

  async convert(req: Request, res: Response) {
    try {
      const { amount, from, to } = req.query;

      if (!amount || !from || !to) {
        return res.status(400).json({
          error: 'Amount, from currency, and to currency are required',
        });
      }

      const convertedAmount = await currencyService.convert(
        parseFloat(amount as string),
        from as string,
        to as string
      );

      const rates = await currencyService.getExchangeRates(from as string);
      const rate = rates[to as string];

      res.json({
        from,
        to,
        amount: parseFloat(amount as string),
        convertedAmount,
        rate,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to convert currency' });
    }
  }

  async getOptimalRate(req: Request, res: Response) {
    try {
      const { from, to } = req.query;

      if (!from || !to) {
        return res.status(400).json({
          error: 'From and to currencies are required',
        });
      }

      const optimalRate = await currencyService.getOptimalRate(
        from as string,
        to as string
      );

      res.json({
        from,
        to,
        optimalRate,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch optimal rate' });
    }
  }

  async getSupportedCurrencies(_req: Request, res: Response) {
    try {
      res.json({ currencies: supportedCurrencies });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch supported currencies' });
    }
  }

  async getHistoricalRates(req: Request, res: Response) {
    try {
      const { from, to, days = '30' } = req.query;

      if (!from || !to) {
        return res.status(400).json({
          error: 'From and to currencies are required',
        });
      }

      const history = await currencyService.getHistoricalRates(
        from as string,
        to as string,
        parseInt(days as string)
      );

      res.json({
        from,
        to,
        history,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch historical rates' });
    }
  }
}

export const currencyController = new CurrencyController();
