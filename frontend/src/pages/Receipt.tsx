import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'convert';
  status: 'completed' | 'pending' | 'failed';
  amount: number;
  currency: string;
  toAmount?: number;
  toCurrency?: string;
  recipient?: string;
  sender?: string;
  note?: string;
  fee: number;
  timestamp: Date;
  transactionHash: string;
}

const Receipt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Mock transaction data - in production, fetch from API
  const transaction: Transaction = {
    id: id || 'TXN-2024-001',
    type: 'send',
    status: 'completed',
    amount: 100.00,
    currency: 'USD',
    recipient: 'wallet_abc123',
    note: 'Payment for services',
    fee: 0.10,
    timestamp: new Date(),
    transactionHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  };

  const downloadAsPDF = async () => {
    setIsDownloading(true);
    
    try {
      if (!receiptRef.current) {
        throw new Error('Receipt element not found');
      }

      addNotification({
        type: 'info',
        title: 'Generating PDF',
        message: 'Please wait while we generate your receipt...',
      });

      // Capture the receipt as canvas
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Calculate dimensions for PDF
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save PDF
      pdf.save(`SwiftMint-Receipt-${transaction.id}.pdf`);

      addNotification({
        type: 'success',
        title: 'PDF Downloaded',
        message: `Receipt ${transaction.id} has been downloaded as PDF`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      addNotification({
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to generate PDF. Please try again.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsImage = async () => {
    setIsDownloading(true);
    
    try {
      if (!receiptRef.current) {
        throw new Error('Receipt element not found');
      }

      addNotification({
        type: 'info',
        title: 'Generating Image',
        message: 'Please wait while we capture your receipt...',
      });

      // Capture the receipt as canvas
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create image');
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SwiftMint-Receipt-${transaction.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addNotification({
          type: 'success',
          title: 'Image Downloaded',
          message: `Receipt ${transaction.id} has been saved as PNG image`,
        });
      }, 'image/png');
    } catch (error) {
      console.error('Image generation error:', error);
      addNotification({
        type: 'error',
        title: 'Download Failed',
        message: 'Failed to generate image. Please try again.',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsJSON = () => {
    const jsonData = JSON.stringify(transaction, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SwiftMint-Receipt-${transaction.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addNotification({
      type: 'success',
      title: 'Receipt Downloaded',
      message: `Receipt ${transaction.id} has been saved as JSON`,
    });
  };

  const printReceipt = () => {
    window.print();
    addNotification({
      type: 'info',
      title: 'Print Dialog Opened',
      message: 'Please select your printer to print the receipt',
    });
  };

  const copyToClipboard = async () => {
    const receiptText = `SwiftMint Receipt ${transaction.id}: ${transaction.type.toUpperCase()} ${transaction.currency} ${transaction.amount.toFixed(2)} - Status: ${transaction.status.toUpperCase()} - Hash: ${transaction.transactionHash}`;
    
    try {
      await navigator.clipboard.writeText(receiptText);
      addNotification({
        type: 'success',
        title: 'Copied to Clipboard',
        message: 'Receipt details copied successfully',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Copy Failed',
        message: 'Failed to copy to clipboard',
      });
    }
  };

  const shareReceipt = async (method: 'email' | 'whatsapp' | 'twitter' | 'link') => {
    const receiptUrl = `${window.location.origin}/receipt/${transaction.id}`;
    const shareText = `SwiftMint Transaction Receipt - ${transaction.id}`;

    switch (method) {
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`View receipt: ${receiptUrl}`)}`;
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${receiptUrl}`)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(receiptUrl)}`, '_blank');
        break;
      case 'link':
        await copyToClipboard();
        break;
    }

    setShowShareModal(false);
    addNotification({
      type: 'success',
      title: 'Sharing Receipt',
      message: `Opening ${method} to share receipt`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'failed':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'send':
        return '↗️';
      case 'receive':
        return '↙️';
      case 'convert':
        return '🔄';
      default:
        return '💰';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <span>←</span> Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={printReceipt}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <span>🖨️</span> Print
          </button>
          
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-2"
          >
            <span>↗️</span> Share
          </button>

          <div className="relative group">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
              <span>⬇️</span> Download
            </button>
            
            {/* Download Dropdown */}
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={downloadAsPDF}
                disabled={isDownloading}
                className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition-colors disabled:opacity-50 flex items-center gap-3"
              >
                <span className="text-xl">📄</span>
                <div>
                  <div className="font-medium">Download as PDF</div>
                  <div className="text-xs text-gray-500">High quality document</div>
                </div>
              </button>
              <button
                onClick={downloadAsImage}
                disabled={isDownloading}
                className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-3"
              >
                <span className="text-xl">🖼️</span>
                <div>
                  <div className="font-medium">Download as Image</div>
                  <div className="text-xs text-gray-500">PNG format</div>
                </div>
              </button>
              <button
                onClick={downloadAsJSON}
                className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg transition-colors flex items-center gap-3"
              >
                <span className="text-xl">📋</span>
                <div>
                  <div className="font-medium">Download as JSON</div>
                  <div className="text-xs text-gray-500">Raw data format</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Container */}
      <div
        ref={receiptRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 print:shadow-none"
      >
        {/* Header */}
        <div className="text-center mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-4">⚡</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">SwiftMint</h1>
          <p className="text-gray-600 dark:text-gray-400">Transaction Receipt</p>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center mb-8">
          <div className={`px-6 py-3 rounded-full font-bold text-lg ${getStatusColor(transaction.status)}`}>
            {transaction.status === 'completed' ? '✓' : transaction.status === 'pending' ? '⏳' : '✕'} {transaction.status.toUpperCase()}
          </div>
        </div>

        {/* Transaction Details */}
        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transaction ID</p>
              <p className="font-mono font-semibold text-gray-900 dark:text-white">{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Type</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {getTypeIcon(transaction.type)} {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {transaction.timestamp.toLocaleDateString()} at {transaction.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{transaction.status}</p>
            </div>
          </div>

          {transaction.recipient && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Recipient</p>
              <p className="font-mono text-gray-900 dark:text-white">{transaction.recipient}</p>
            </div>
          )}

          {transaction.sender && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sender</p>
              <p className="font-mono text-gray-900 dark:text-white">{transaction.sender}</p>
            </div>
          )}

          {transaction.note && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Note</p>
              <p className="text-gray-900 dark:text-white">{transaction.note}</p>
            </div>
          )}
        </div>

        {/* Amount Breakdown */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Amount Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Amount</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {transaction.currency} {transaction.amount.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Fee (0.1%)</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {transaction.currency} {transaction.fee.toFixed(2)}
              </span>
            </div>

            {transaction.toAmount && transaction.toCurrency && (
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Converted to</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {transaction.toCurrency} {transaction.toAmount.toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                {transaction.currency} {(transaction.amount + transaction.fee).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Hash */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Transaction Hash</p>
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 flex items-center justify-between">
            <code className="font-mono text-sm text-gray-900 dark:text-white break-all">
              {transaction.transactionHash}
            </code>
            <button
              onClick={copyToClipboard}
              className="ml-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Copy hash"
            >
              📋
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            ⚡ SwiftMint - Instant Global Micro-Payments
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Ultra-low fees · Instant transfers · Multi-currency support
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
            This is an official receipt from SwiftMint. Keep this for your records.
          </p>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Receipt</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => shareReceipt('email')}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-3"
              >
                <span className="text-2xl">📧</span>
                <span className="font-medium">Share via Email</span>
              </button>

              <button
                onClick={() => shareReceipt('whatsapp')}
                className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-3"
              >
                <span className="text-2xl">💬</span>
                <span className="font-medium">Share on WhatsApp</span>
              </button>

              <button
                onClick={() => shareReceipt('twitter')}
                className="w-full px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-3"
              >
                <span className="text-2xl">🐦</span>
                <span className="font-medium">Share on Twitter</span>
              </button>

              <button
                onClick={() => shareReceipt('link')}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-3"
              >
                <span className="text-2xl">🔗</span>
                <span className="font-medium">Copy Link</span>
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #root, #root * {
            visibility: visible;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Receipt;
