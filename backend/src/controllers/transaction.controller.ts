import { Request, Response } from 'express';
import { transactionService } from '../services/transaction.service';

export class TransactionController {
  async send(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { recipientEmail, amount, currency } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!recipientEmail || !amount || !currency) {
        return res.status(400).json({
          error: 'Recipient email, amount, and currency are required',
        });
      }

      const transaction = await transactionService.send(
        userId,
        recipientEmail,
        amount,
        currency
      );

      res.status(201).json({ transaction });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send payment' });
    }
  }

  async receive(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { amount, currency } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!amount || !currency) {
        return res.status(400).json({ error: 'Amount and currency are required' });
      }

      const transaction = await transactionService.receive(userId, amount, currency);

      res.status(201).json({ transaction });
    } catch (error) {
      res.status(500).json({ error: 'Failed to receive payment' });
    }
  }

  async convert(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { amount, fromCurrency, toCurrency } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!amount || !fromCurrency || !toCurrency) {
        return res.status(400).json({
          error: 'Amount, from currency, and to currency are required',
        });
      }

      const transaction = await transactionService.convertCurrency(
        userId,
        amount,
        fromCurrency,
        toCurrency
      );

      res.status(201).json({ transaction });
    } catch (error) {
      res.status(500).json({ error: 'Failed to convert currency' });
    }
  }

  async getTransactions(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const transactions = await transactionService.getTransactionsByUserId(userId);

      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }

  async getTransactionById(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const transaction = await transactionService.getTransactionById(id);

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      if (transaction.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      res.json({ transaction });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transaction' });
    }
  }
}

export const transactionController = new TransactionController();
