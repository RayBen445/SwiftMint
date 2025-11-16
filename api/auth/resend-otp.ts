import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone number is required' });
    }

    // Mock OTP generation and sending
    // In production, this would generate a new OTP and send via email/SMS
    const mockOTP = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`Mock OTP for ${email || phone}: ${mockOTP}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      // In production, never send OTP in response
      demo: {
        otp: '123456',
        note: 'Use this OTP for demo purposes',
      },
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
