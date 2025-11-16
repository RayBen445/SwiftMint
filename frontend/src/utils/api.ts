const API_BASE = '/api';

export async function sendMoney(data: {
  fromWallet: string;
  toWallet: string;
  amount: number;
  currency: string;
  note?: string;
}) {
  const response = await fetch(`${API_BASE}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send money');
  }
  
  return response.json();
}

export async function requestMoney(data: {
  walletId: string;
  amount: number;
  currency: string;
  requesterId?: string;
  note?: string;
}) {
  const response = await fetch(`${API_BASE}/receive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment request');
  }
  
  return response.json();
}

export async function convertCurrency(data: {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}) {
  const response = await fetch(`${API_BASE}/convert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to convert currency');
  }
  
  return response.json();
}

export async function getExchangeRates(currencies?: string[]) {
  const params = currencies ? `?currencies=${currencies.join(',')}` : '';
  const response = await fetch(`${API_BASE}/rates${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch exchange rates');
  }
  
  return response.json();
}

export async function getTransactions(params?: {
  walletId?: string;
  type?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.walletId) queryParams.append('walletId', params.walletId);
  if (params?.type) queryParams.append('type', params.type);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  
  const response = await fetch(`${API_BASE}/transactions?${queryParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  
  return response.json();
}
