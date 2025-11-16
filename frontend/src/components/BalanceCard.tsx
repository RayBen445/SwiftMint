import React from 'react';

interface BalanceCardProps {
  balance: number;
  currency: string;
  walletName?: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, currency, walletName = 'Main Wallet' }) => {
  return (
    <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
      <div className="flex flex-col gap-2">
        <p className="text-sm opacity-90">{walletName}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
            }).format(balance)}
          </span>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <p className="text-xs opacity-75">Available</p>
            <p className="text-lg font-semibold">{currency} {balance.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
