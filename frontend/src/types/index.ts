export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'convert';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  fromWallet?: string;
  toWallet?: string;
  note?: string;
}

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
}

export interface ExchangeRate {
  base: string;
  rates: Record<string, number>;
  lastUpdate: string;
}

export interface ConversionResult {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  timestamp: string;
}
