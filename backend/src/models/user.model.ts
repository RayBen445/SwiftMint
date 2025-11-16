export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthCredentials {
  email?: string;
  phone?: string;
  password: string;
}

// In-memory user storage (mock database)
export const users: Map<string, User> = new Map();
