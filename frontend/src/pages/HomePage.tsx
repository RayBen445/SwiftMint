import { useState, useEffect } from 'react';
import BalanceCard from '../components/BalanceCard';
import QuickActions from '../components/QuickActions';
import TransactionList from '../components/TransactionList';

export default function HomePage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Mock fetching transactions
    fetch('/api/transactions?userId=mock-user-id')
      .then((res) => res.json())
      .then((data) => setTransactions(data.transactions || []))
      .catch(() => setTransactions([]));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600">
          Send money globally with ultra-low fees
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BalanceCard currency="USD" balance={1250.50} symbol="$" />
        <BalanceCard currency="EUR" balance={850.75} symbol="€" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <QuickActions />
      </div>

      <TransactionList transactions={transactions} />
    </div>
  );
}
