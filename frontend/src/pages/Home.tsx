import React, { useEffect, useState } from 'react';
import BalanceCard from '../components/BalanceCard';
import QuickActions from '../components/QuickActions';
import TransactionList from '../components/TransactionList';
import { getTransactions } from '../utils/api';
import type { Transaction } from '../types';

const Home: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions({ limit: 5 });
        setTransactions(response.transactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to SwiftMint</h1>
        <p className="text-gray-600">Instant global micro-payments with ultra-low fees</p>
      </div>

      <BalanceCard balance={1250.50} currency="USD" />

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <QuickActions />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
        <TransactionList transactions={transactions} loading={loading} />
      </div>
    </div>
  );
};

export default Home;
