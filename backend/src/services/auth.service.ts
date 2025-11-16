import { v4 as uuidv4 } from 'uuid';
import { User, users, AuthCredentials } from '../models/user.model';

export class AuthService {
  async register(credentials: AuthCredentials & { name: string }): Promise<User> {
    const userId = uuidv4();
    const user: User = {
      id: userId,
      email: credentials.email || '',
      phone: credentials.phone,
      name: credentials.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.set(userId, user);
    return user;
  }

  async login(credentials: AuthCredentials): Promise<User | null> {
    // Mock login - find user by email or phone
    for (const user of users.values()) {
      if (
        (credentials.email && user.email === credentials.email) ||
        (credentials.phone && user.phone === credentials.phone)
      ) {
        return user;
      }
    }
    return null;
  }

  async getUserById(userId: string): Promise<User | null> {
    return users.get(userId) || null;
  }

  // Mock JWT token generation (not actual implementation)
  generateToken(userId: string): string {
    return `mock-token-${userId}-${Date.now()}`;
  }
}

export const authService = new AuthService();
