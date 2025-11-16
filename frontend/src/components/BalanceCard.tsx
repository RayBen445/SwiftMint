interface BalanceCardProps {
  currency: string;
  balance: number;
  symbol: string;
}

export default function BalanceCard({ currency, balance, symbol }: BalanceCardProps) {
  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-primary-100 text-sm">Available Balance</p>
          <h2 className="text-3xl font-bold mt-1">
            {symbol}
            {balance.toFixed(2)}
          </h2>
        </div>
        <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
          <span className="text-sm font-medium">{currency}</span>
        </div>
      </div>
      <div className="flex space-x-4 mt-6">
        <button className="flex-1 bg-white text-primary-700 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition">
          Add Money
        </button>
        <button className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition">
          Withdraw
        </button>
      </div>
    </div>
  );
}
