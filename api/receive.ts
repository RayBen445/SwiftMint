import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ReceivePaymentRequest {
  amount: number;
  currency: string;
  userId?: string;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency, userId } = req.body as ReceivePaymentRequest;

  if (!amount || !currency) {
    return res.status(400).json({
      error: 'Amount and currency are required',
    });
  }

  // Mock transaction response
  const transaction = {
    id: `txn_${Date.now()}`,
    userId: userId || 'mock-user-id',
    type: 'receive',
    amount,
    currency,
    status: 'completed',
    fee: 0,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };

  res.status(201).json({
    success: true,
    transaction,
  });
}
