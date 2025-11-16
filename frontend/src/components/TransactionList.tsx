import React from 'react';
import type { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  loading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p className="text-lg">No transactions yet</p>
        <p className="text-sm mt-2">Your transaction history will appear here</p>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'send': return '↗️';
      case 'receive': return '↙️';
      case 'convert': return '🔄';
      default: return '💱';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">{getTypeIcon(transaction.type)}</div>
              <div>
                <h3 className="font-semibold text-gray-900 capitalize">{transaction.type}</h3>
                <p className="text-sm text-gray-500">{transaction.note || 'No description'}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(transaction.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${transaction.type === 'send' ? 'text-red-600' : 'text-green-600'}`}>
                {transaction.type === 'send' ? '-' : '+'}{transaction.currency} {transaction.amount.toFixed(2)}
              </p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
