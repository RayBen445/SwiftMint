import { Request, Response } from 'express';
import { walletService } from '../services/wallet.service';

export class WalletController {
  async getWallet(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      let wallet = await walletService.getWalletByUserId(userId);

      if (!wallet) {
        // Create wallet if it doesn't exist
        wallet = await walletService.createWallet(userId);
      }

      res.json({ wallet });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch wallet' });
    }
  }

  async addPocket(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { currency, symbol } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!currency || !symbol) {
        return res.status(400).json({ error: 'Currency and symbol are required' });
      }

      const wallet = await walletService.getWalletByUserId(userId);

      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }

      const updatedWallet = await walletService.addPocket(wallet.id, currency, symbol);

      res.json({ wallet: updatedWallet });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add currency pocket' });
    }
  }

  async getBalance(req: Request, res: Response) {
    try {
      const userId = req.headers['x-user-id'] as string;
      const { currency } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const wallet = await walletService.getWalletByUserId(userId);

      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }

      const balance = await walletService.getBalance(wallet.id, currency);

      if (balance === null) {
        return res.status(404).json({ error: 'Currency pocket not found' });
      }

      res.json({ currency, balance });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch balance' });
    }
  }
}

export const walletController = new WalletController();
