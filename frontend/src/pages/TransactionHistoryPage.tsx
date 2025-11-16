import { useState, useEffect } from 'react';
import TransactionList from '../components/TransactionList';

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions?userId=mock-user-id');
        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions =
    filter === 'all'
      ? transactions
      : transactions.filter((t: { type: string }) => t.type === filter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
        <p className="text-gray-600">View and manage your transaction history</p>
      </div>

      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('send')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'send'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sent
        </button>
        <button
          onClick={() => setFilter('receive')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'receive'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Received
        </button>
        <button
          onClick={() => setFilter('convert')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'convert'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Conversions
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading transactions...</p>
        </div>
      ) : (
        <TransactionList transactions={filteredTransactions} />
      )}
    </div>
  );
}
