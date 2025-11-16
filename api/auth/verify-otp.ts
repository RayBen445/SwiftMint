import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, email, phone } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'OTP code is required' });
    }

    // Mock OTP verification
    // In production, this would verify against stored OTP
    const validOTP = '123456'; // Demo OTP

    if (code !== validOTP) {
      return res.status(401).json({ error: 'Invalid OTP code' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      verified: true,
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
