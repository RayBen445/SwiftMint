import { VercelRequest, VercelResponse } from '@vercel/node';

interface ReceiveRequest {
  walletId: string;
  amount: number;
  currency: string;
  requesterId?: string;
  note?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === 'POST') {
    // Create a payment request
    try {
      const { walletId, amount, currency, requesterId, note }: ReceiveRequest = req.body;

      if (!walletId || !amount || !currency) {
        return res.status(400).json({ 
          error: 'Missing required fields: walletId, amount, currency' 
        });
      }

      const paymentRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        walletId,
        amount,
        currency,
        requesterId: requesterId || 'anonymous',
        note: note || '',
        status: 'pending',
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=swiftmint://pay/${walletId}/${amount}/${currency}`,
        paymentLink: `https://swiftmint.app/pay/${walletId}?amount=${amount}&currency=${currency}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        createdAt: new Date().toISOString(),
      };

      return res.status(201).json({
        success: true,
        paymentRequest,
        message: 'Payment request created successfully',
      });
    } catch (error) {
      console.error('Receive payment request error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    // Get payment request status
    const { requestId } = req.query;

    if (!requestId) {
      return res.status(400).json({ error: 'Missing requestId parameter' });
    }

    // Mock payment request status
    return res.status(200).json({
      success: true,
      paymentRequest: {
        id: requestId,
        status: 'pending',
        amount: 100,
        currency: 'USD',
        createdAt: new Date().toISOString(),
      },
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
