export interface CurrencyPocket {
  currency: string;
  balance: number;
  symbol: string;
}

export interface Wallet {
  id: string;
  userId: string;
  pockets: CurrencyPocket[];
  createdAt: Date;
  updatedAt: Date;
}

// In-memory wallet storage (mock database)
export const wallets: Map<string, Wallet> = new Map();

export const supportedCurrencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];
