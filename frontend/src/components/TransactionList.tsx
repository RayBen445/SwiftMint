interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency?: string;
  fromCurrency?: string;
  toCurrency?: string;
  recipientEmail?: string;
  status: string;
  createdAt: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'send':
        return '↗️';
      case 'receive':
        return '↙️';
      case 'convert':
        return '🔄';
      default:
        return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'send':
        return 'text-red-600';
      case 'receive':
        return 'text-green-600';
      case 'convert':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
      </div>
      <div className="divide-y">
        {transactions.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No transactions yet
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="px-6 py-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getTypeIcon(transaction.type)}</div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {transaction.type}
                      {transaction.recipientEmail && ` to ${transaction.recipientEmail}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'send' && '-'}
                    {transaction.type === 'receive' && '+'}
                    {transaction.amount}
                    {transaction.currency || transaction.fromCurrency}
                  </p>
                  {transaction.type === 'convert' && transaction.toCurrency && (
                    <p className="text-sm text-gray-500">
                      → {transaction.toCurrency}
                    </p>
                  )}
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
