import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Receipt {
  id: string;
  type: string;
  amount: number;
  currency: string;
  recipientEmail?: string;
  fromCurrency?: string;
  toCurrency?: string;
  status: string;
  fee: number;
  createdAt: string;
  completedAt?: string;
}

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        // Mock receipt data
        await new Promise(resolve => setTimeout(resolve, 500));
        setReceipt({
          id: id || 'txn_123',
          type: 'send',
          amount: 50.00,
          currency: 'USD',
          recipientEmail: 'jane@example.com',
          status: 'completed',
          fee: 0.05,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Failed to fetch receipt:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('PDF download would be triggered here');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Receipt not found</p>
          <button
            onClick={() => navigate('/transactions')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Back to Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Action Buttons (hide on print) */}
      <div className="mb-6 flex justify-between items-center print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-700 font-medium"
        >
          ← Back
        </button>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            🖨️ Print
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* Receipt Card */}
      <div className="bg-white rounded-xl shadow-lg border p-8">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <span className="text-3xl font-bold text-primary-700">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SwiftMint</h1>
          <p className="text-gray-600 text-sm">Transaction Receipt</p>
        </div>

        {/* Status Badge */}
        <div className="text-center mb-6">
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              receipt.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : receipt.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {receipt.status.toUpperCase()}
          </span>
        </div>

        {/* Transaction Amount */}
        <div className="text-center mb-8 py-6 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Amount</p>
          <p className="text-4xl font-bold text-gray-900">
            ${receipt.amount.toFixed(2)} {receipt.currency}
          </p>
          {receipt.type === 'convert' && receipt.toCurrency && (
            <p className="text-sm text-gray-600 mt-2">
              Converted to {receipt.toCurrency}
            </p>
          )}
        </div>

        {/* Transaction Details */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-mono font-medium text-gray-900">{receipt.id}</span>
          </div>

          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Type</span>
            <span className="font-medium text-gray-900 capitalize">{receipt.type}</span>
          </div>

          {receipt.recipientEmail && (
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Recipient</span>
              <span className="font-medium text-gray-900">{receipt.recipientEmail}</span>
            </div>
          )}

          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Transaction Fee</span>
            <span className="font-medium text-gray-900">
              ${receipt.fee.toFixed(2)} {receipt.currency}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Date</span>
            <span className="font-medium text-gray-900">
              {new Date(receipt.createdAt).toLocaleString()}
            </span>
          </div>

          {receipt.completedAt && (
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600">Completed At</span>
              <span className="font-medium text-gray-900">
                {new Date(receipt.completedAt).toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between py-3 font-bold text-lg">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">
              ${(receipt.amount + receipt.fee).toFixed(2)} {receipt.currency}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 pt-6 border-t">
          <p className="mb-2">Thank you for using SwiftMint</p>
          <p>For support, contact support@swiftmint.com</p>
          <p className="mt-4 text-xs">
            This is an electronic receipt. No signature required.
          </p>
        </div>
      </div>

      {/* Help Text (hide on print) */}
      <div className="mt-6 text-center text-sm text-gray-600 print:hidden">
        <p>Need help with this transaction? <a href="#" className="text-primary-600 hover:text-primary-700">Contact Support</a></p>
      </div>
    </div>
  );
}
