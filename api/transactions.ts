import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock transaction data
const mockTransactions = [
  {
    id: 'txn_1',
    userId: 'mock-user-id',
    type: 'send',
    amount: 50.0,
    currency: 'USD',
    recipientEmail: 'john@example.com',
    status: 'completed',
    fee: 0.05,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'txn_2',
    userId: 'mock-user-id',
    type: 'receive',
    amount: 100.0,
    currency: 'EUR',
    status: 'completed',
    fee: 0,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'txn_3',
    userId: 'mock-user-id',
    type: 'convert',
    amount: 200.0,
    fromCurrency: 'USD',
    toCurrency: 'GBP',
    convertedAmount: 158.0,
    exchangeRate: 0.79,
    status: 'completed',
    fee: 0.2,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    completedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.query.userId as string || 'mock-user-id';
  const limit = parseInt(req.query.limit as string) || 10;

  // Filter transactions by userId and limit
  const transactions = mockTransactions
    .filter(txn => txn.userId === userId)
    .slice(0, limit);

  res.status(200).json({
    success: true,
    transactions,
    total: transactions.length,
  });
}
