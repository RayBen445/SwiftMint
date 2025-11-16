import { v4 as uuidv4 } from 'uuid';
import { Transaction, transactions, TransactionType, TransactionStatus } from '../models/transaction.model';
import { walletService } from './wallet.service';
import { currencyService } from './currency.service';

export class TransactionService {
  async createTransaction(
    userId: string,
    type: TransactionType,
    amount: number,
    currency: string,
    options?: {
      recipientId?: string;
      recipientEmail?: string;
      fromCurrency?: string;
      toCurrency?: string;
      description?: string;
    }
  ): Promise<Transaction> {
    const transactionId = uuidv4();
    const fee = this.calculateFee(amount);
    
    let exchangeRate: number | undefined;
    if (options?.fromCurrency && options?.toCurrency) {
      const rates = await currencyService.getExchangeRates(options.fromCurrency);
      exchangeRate = rates[options.toCurrency];
    }

    const transaction: Transaction = {
      id: transactionId,
      userId,
      type,
      amount,
      currency,
      fromCurrency: options?.fromCurrency,
      toCurrency: options?.toCurrency,
      recipientId: options?.recipientId,
      recipientEmail: options?.recipientEmail,
      status: 'pending',
      fee,
      exchangeRate,
      description: options?.description,
      createdAt: new Date(),
    };

    transactions.set(transactionId, transaction);
    return transaction;
  }

  async send(
    userId: string,
    recipientEmail: string,
    amount: number,
    currency: string
  ): Promise<Transaction> {
    const transaction = await this.createTransaction(userId, 'send', amount, currency, {
      recipientEmail,
      description: `Send ${amount} ${currency} to ${recipientEmail}`,
    });

    // Mock processing
    setTimeout(() => {
      this.completeTransaction(transaction.id);
    }, 1000);

    return transaction;
  }

  async receive(
    userId: string,
    amount: number,
    currency: string
  ): Promise<Transaction> {
    const transaction = await this.createTransaction(userId, 'receive', amount, currency, {
      description: `Received ${amount} ${currency}`,
    });

    // Auto-complete receive transactions
    this.completeTransaction(transaction.id);
    return transaction;
  }

  async convertCurrency(
    userId: string,
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<Transaction> {
    const convertedAmount = await currencyService.convert(amount, fromCurrency, toCurrency);
    
    const transaction = await this.createTransaction(userId, 'convert', amount, fromCurrency, {
      fromCurrency,
      toCurrency,
      description: `Convert ${amount} ${fromCurrency} to ${convertedAmount.toFixed(2)} ${toCurrency}`,
    });

    // Mock processing
    setTimeout(() => {
      this.completeTransaction(transaction.id);
    }, 500);

    return transaction;
  }

  async completeTransaction(transactionId: string): Promise<Transaction | null> {
    const transaction = transactions.get(transactionId);
    if (!transaction) return null;

    transaction.status = 'completed';
    transaction.completedAt = new Date();
    transactions.set(transactionId, transaction);
    return transaction;
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    const userTransactions: Transaction[] = [];
    for (const transaction of transactions.values()) {
      if (transaction.userId === userId) {
        userTransactions.push(transaction);
      }
    }
    return userTransactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTransactionById(transactionId: string): Promise<Transaction | null> {
    return transactions.get(transactionId) || null;
  }

  private calculateFee(amount: number): number {
    // Ultra-low fee: 0.1% with minimum $0.01
    const percentageFee = amount * 0.001;
    return Math.max(percentageFee, 0.01);
  }
}

export const transactionService = new TransactionService();
