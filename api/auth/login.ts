import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock user database
const MOCK_USERS = [
  {
    id: 'user_demo',
    email: 'demo@swiftmint.app',
    password: 'demo123', // In production, this would be hashed
    name: 'Demo User',
    walletId: 'wallet_demo123',
    phone: '+1234567890',
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate mock JWT token
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // Return user data (excluding password)
    const { password: _, ...userData } = user;

    res.status(200).json({
      success: true,
      user: userData,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
