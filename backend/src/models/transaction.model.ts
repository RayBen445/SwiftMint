export type TransactionType = 'send' | 'receive' | 'convert';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  fromCurrency?: string;
  toCurrency?: string;
  recipientId?: string;
  recipientEmail?: string;
  status: TransactionStatus;
  fee: number;
  exchangeRate?: number;
  description?: string;
  createdAt: Date;
  completedAt?: Date;
}

// In-memory transaction storage (mock database)
export const transactions: Map<string, Transaction> = new Map();
