import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { walletService } from '../services/wallet.service';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, phone, password, name } = req.body;

      if (!name || !password || (!email && !phone)) {
        return res.status(400).json({
          error: 'Name, password, and either email or phone are required',
        });
      }

      const user = await authService.register({ email, phone, password, name });
      
      // Create wallet for new user
      await walletService.createWallet(user.id);

      const token = authService.generateToken(user.id);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, phone, password } = req.body;

      if (!password || (!email && !phone)) {
        return res.status(400).json({
          error: 'Password and either email or phone are required',
        });
      }

      const user = await authService.login({ email, phone, password });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = authService.generateToken(user.id);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      // Mock user ID from auth middleware
      const userId = req.headers['x-user-id'] as string;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
}

export const authController = new AuthController();
