import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import CurrencySelector from '../components/CurrencySelector';

interface Recipient {
  id: string;
  walletId: string;
  amount: number;
  percentage?: number;
}

const SplitPayment: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [totalAmount, setTotalAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [note, setNote] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', walletId: '', amount: 0 },
    { id: '2', walletId: '', amount: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const addRecipient = () => {
    const newId = (recipients.length + 1).toString();
    setRecipients([...recipients, { id: newId, walletId: '', amount: 0 }]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length > 2) {
      setRecipients(recipients.filter(r => r.id !== id));
    } else {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'You need at least 2 recipients for split payment',
      });
    }
  };

  const updateRecipient = (id: string, field: keyof Recipient, value: string | number) => {
    setRecipients(recipients.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const calculateSplit = () => {
    const total = parseFloat(totalAmount) || 0;
    
    if (splitType === 'equal') {
      const amountPerPerson = total / recipients.length;
      return recipients.map(r => ({ ...r, amount: amountPerPerson }));
    }
    
    return recipients;
  };

  const getTotalDistributed = () => {
    if (splitType === 'equal') {
      return parseFloat(totalAmount) || 0;
    }
    
    return recipients.reduce((sum, r) => sum + (parseFloat(r.amount.toString()) || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const total = parseFloat(totalAmount) || 0;
    const distributed = getTotalDistributed();

    if (Math.abs(total - distributed) > 0.01) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Total distributed (${distributed.toFixed(2)}) doesn't match total amount (${total.toFixed(2)})`,
      });
      setLoading(false);
      return;
    }

    // Validate all wallet IDs
    const invalidRecipients = recipients.filter(r => !r.walletId.trim());
    if (invalidRecipients.length > 0) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Please fill in all wallet IDs',
      });
      setLoading(false);
      return;
    }

    try {
      // Mock split payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const finalRecipients = calculateSplit();
      
      // Store transaction data
      const transaction = {
        id: `SPL-${Date.now()}`,
        type: 'split',
        status: 'completed',
        amount: total,
        currency: currency,
        recipients: finalRecipients,
        note: note,
        fee: total * 0.001 * recipients.length, // 0.1% per recipient
        timestamp: new Date(),
        transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      };

      localStorage.setItem('lastTransaction', JSON.stringify(transaction));

      addNotification({
        type: 'success',
        title: 'Success',
        message: `Successfully split ${currency} ${total} among ${recipients.length} recipients!`,
      });

      setTimeout(() => {
        navigate('/receipt');
      }, 1000);
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to process split payment',
      });
    } finally {
      setLoading(false);
    }
  };

  const distributedAmount = getTotalDistributed();
  const remaining = (parseFloat(totalAmount) || 0) - distributedAmount;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Split Payment</h1>
        <p className="text-gray-600 dark:text-gray-400">Divide payment among multiple recipients</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Total Amount */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Total Amount</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="100.00"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <CurrencySelector
              value={currency}
              onChange={setCurrency}
              label="Currency"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Split Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSplitType('equal')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  splitType === 'equal'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                ⚖️ Split Equally
              </button>
              <button
                type="button"
                onClick={() => setSplitType('custom')}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  splitType === 'custom'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                ✏️ Custom Amounts
              </button>
            </div>
          </div>
        </div>

        {/* Recipients */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recipients ({recipients.length})
            </h2>
            <button
              type="button"
              onClick={addRecipient}
              className="btn-secondary text-sm"
            >
              + Add Recipient
            </button>
          </div>

          <div className="space-y-4">
            {calculateSplit().map((recipient, index) => (
              <div key={recipient.id} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {index + 1}
                </div>
                
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Wallet ID
                    </label>
                    <input
                      type="text"
                      value={recipient.walletId}
                      onChange={(e) => updateRecipient(recipient.id, 'walletId', e.target.value)}
                      placeholder="wallet_abc123"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount
                    </label>
                    {splitType === 'equal' ? (
                      <input
                        type="text"
                        value={recipient.amount.toFixed(2)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-sm"
                      />
                    ) : (
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={recipient.amount || ''}
                        onChange={(e) => updateRecipient(recipient.id, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                      />
                    )}
                  </div>
                </div>

                {recipients.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeRecipient(recipient.id)}
                    className="flex-shrink-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Distributed:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {currency} {distributedAmount.toFixed(2)}
              </span>
            </div>
            {splitType === 'custom' && (
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                <span className={`font-semibold ${
                  Math.abs(remaining) < 0.01 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {currency} {remaining.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Note */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Note (Optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for this split payment"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || Math.abs(remaining) > 0.01}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Split & Send ${currency} ${(parseFloat(totalAmount) || 0).toFixed(2)}`}
        </button>
      </form>

      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Split Payment Info</h3>
        <p className="text-sm text-blue-800 dark:text-blue-400">
          Split payments charge 0.1% fee per recipient. Splitting ${currency} 100 among 3 people costs just ${(100 * 0.001 * 3).toFixed(2)} in fees!
        </p>
      </div>
    </div>
  );
};

export default SplitPayment;
