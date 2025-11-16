import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Generate user ID and wallet ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const walletId = `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In production, hash password and save to database
    // For demo, we'll create a mock user
    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      name,
      walletId,
      phone: phone || null,
      createdAt: new Date().toISOString(),
    };

    // Generate mock JWT token
    const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');

    res.status(201).json({
      success: true,
      user: newUser,
      token,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
