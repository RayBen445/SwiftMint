import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SendPaymentRequest {
  recipientEmail: string;
  amount: number;
  currency: string;
  userId?: string;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipientEmail, amount, currency, userId } = req.body as SendPaymentRequest;

  if (!recipientEmail || !amount || !currency) {
    return res.status(400).json({
      error: 'Recipient email, amount, and currency are required',
    });
  }

  // Mock transaction response
  const transaction = {
    id: `txn_${Date.now()}`,
    userId: userId || 'mock-user-id',
    type: 'send',
    amount,
    currency,
    recipientEmail,
    status: 'completed',
    fee: Math.max(amount * 0.001, 0.01),
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };

  res.status(201).json({
    success: true,
    transaction,
  });
}
