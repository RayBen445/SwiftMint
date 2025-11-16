import { VercelRequest, VercelResponse } from '@vercel/node';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'convert';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  fromWallet?: string;
  toWallet?: string;
  note?: string;
}

// Mock transaction data
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_1699876543210_abc123',
    type: 'send',
    amount: 150.00,
    currency: 'USD',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    fromWallet: 'wallet_user123',
    toWallet: 'wallet_user456',
    note: 'Payment for services',
  },
  {
    id: 'txn_1699876543211_def456',
    type: 'receive',
    amount: 75.50,
    currency: 'EUR',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    fromWallet: 'wallet_user789',
    toWallet: 'wallet_user123',
    note: 'Freelance work payment',
  },
  {
    id: 'txn_1699876543212_ghi789',
    type: 'convert',
    amount: 200.00,
    currency: 'GBP',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    note: 'Converted USD to GBP',
  },
  {
    id: 'txn_1699876543213_jkl012',
    type: 'send',
    amount: 45.25,
    currency: 'CAD',
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    fromWallet: 'wallet_user123',
    toWallet: 'wallet_user999',
    note: 'Dinner split',
  },
  {
    id: 'txn_1699876543214_mno345',
    type: 'receive',
    amount: 320.00,
    currency: 'USD',
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    fromWallet: 'wallet_user555',
    toWallet: 'wallet_user123',
    note: 'Rent contribution',
  },
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { walletId, type, status, limit = '10', offset = '0' } = req.query;

    let transactions = [...MOCK_TRANSACTIONS];

    // Filter by wallet ID
    if (walletId) {
      transactions = transactions.filter(
        tx => tx.fromWallet === walletId || tx.toWallet === walletId
      );
    }

    // Filter by type
    if (type && ['send', 'receive', 'convert'].includes(type as string)) {
      transactions = transactions.filter(tx => tx.type === type);
    }

    // Filter by status
    if (status && ['completed', 'pending', 'failed'].includes(status as string)) {
      transactions = transactions.filter(tx => tx.status === status);
    }

    // Pagination
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);
    const paginatedTransactions = transactions.slice(offsetNum, offsetNum + limitNum);

    return res.status(200).json({
      success: true,
      transactions: paginatedTransactions,
      total: transactions.length,
      limit: limitNum,
      offset: offsetNum,
      hasMore: offsetNum + limitNum < transactions.length,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
