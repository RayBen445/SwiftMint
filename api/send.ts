import { VercelRequest, VercelResponse } from '@vercel/node';

interface SendRequest {
  fromWallet: string;
  toWallet: string;
  amount: number;
  currency: string;
  note?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fromWallet, toWallet, amount, currency, note }: SendRequest = req.body;

    // Validation
    if (!fromWallet || !toWallet || !amount || !currency) {
      return res.status(400).json({ 
        error: 'Missing required fields: fromWallet, toWallet, amount, currency' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Mock transaction processing
    const transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromWallet,
      toWallet,
      amount,
      currency,
      note: note || '',
      fee: amount * 0.001, // 0.1% fee
      total: amount + (amount * 0.001),
      status: 'completed',
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      transaction,
      message: 'Transaction completed successfully',
    });
  } catch (error) {
    console.error('Send transaction error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
