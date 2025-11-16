import { v4 as uuidv4 } from 'uuid';
import { Wallet, wallets, CurrencyPocket } from '../models/wallet.model';

export class WalletService {
  async createWallet(userId: string): Promise<Wallet> {
    const walletId = uuidv4();
    const wallet: Wallet = {
      id: walletId,
      userId,
      pockets: [
        { currency: 'USD', balance: 0, symbol: '$' },
        { currency: 'EUR', balance: 0, symbol: '€' },
        { currency: 'GBP', balance: 0, symbol: '£' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    wallets.set(walletId, wallet);
    return wallet;
  }

  async getWalletByUserId(userId: string): Promise<Wallet | null> {
    for (const wallet of wallets.values()) {
      if (wallet.userId === userId) {
        return wallet;
      }
    }
    return null;
  }

  async addPocket(walletId: string, currency: string, symbol: string): Promise<Wallet | null> {
    const wallet = wallets.get(walletId);
    if (!wallet) return null;

    const existingPocket = wallet.pockets.find(p => p.currency === currency);
    if (existingPocket) return wallet;

    wallet.pockets.push({ currency, balance: 0, symbol });
    wallet.updatedAt = new Date();
    wallets.set(walletId, wallet);
    return wallet;
  }

  async updateBalance(
    walletId: string,
    currency: string,
    amount: number
  ): Promise<Wallet | null> {
    const wallet = wallets.get(walletId);
    if (!wallet) return null;

    const pocket = wallet.pockets.find(p => p.currency === currency);
    if (!pocket) return null;

    pocket.balance += amount;
    wallet.updatedAt = new Date();
    wallets.set(walletId, wallet);
    return wallet;
  }

  async getBalance(walletId: string, currency: string): Promise<number | null> {
    const wallet = wallets.get(walletId);
    if (!wallet) return null;

    const pocket = wallet.pockets.find(p => p.currency === currency);
    return pocket ? pocket.balance : null;
  }
}

export const walletService = new WalletService();
