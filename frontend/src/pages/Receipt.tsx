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

  // Load transaction data from localStorage or use mock data
  const getTransactionData = (): Transaction => {
    const storedTransaction = localStorage.getItem('lastTransaction');
    
    if (storedTransaction) {
      const parsed = JSON.parse(storedTransaction);
      return {
        ...parsed,
        timestamp: new Date(parsed.timestamp || Date.now()),
      };
    }
    
    // Fallback to mock data
    return {
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
  };

  const transaction: Transaction = getTransactionData();

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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden print:shadow-none"
      >
        {/* Decorative Header with Gradient */}
        <div className="relative bg-gradient-to-br from-sky-500 via-blue-600 to-fuchsia-600 p-8 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl">⚡</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">SwiftMint</h1>
                  <p className="text-sm text-blue-100">Instant Global Payments</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Receipt #</p>
                <p className="font-mono font-bold">{transaction.id}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <div className={`px-6 py-3 rounded-full font-bold text-lg backdrop-blur-sm ${
                transaction.status === 'completed' 
                  ? 'bg-green-500/90 text-white' 
                  : transaction.status === 'pending'
                  ? 'bg-yellow-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              }`}>
                {transaction.status === 'completed' ? '✓' : transaction.status === 'pending' ? '⏳' : '✕'} {transaction.status.toUpperCase()}
              </div>
            </div>
          </div>
          
          {/* Decorative Wave */}
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: '60px' }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white dark:fill-gray-800"></path>
          </svg>
        </div>

        <div className="p-8 pt-4">

        {/* Transaction Type Badge */}
        <div className="flex justify-center -mt-6 mb-8">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <span className="text-2xl">{getTypeIcon(transaction.type)}</span>
            <span className="font-bold text-lg">{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Transaction</span>
          </div>
        </div>

        {/* Main Amount Display */}
        <div className="text-center mb-8 py-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-xl">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Amount</p>
          <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-fuchsia-600 dark:from-sky-400 dark:to-fuchsia-400">
            {transaction.currency} {(transaction.amount + transaction.fee).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {transaction.amount.toFixed(2)} + {transaction.fee.toFixed(2)} fee
          </p>
        </div>

        {/* Transaction Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-gray-900 dark:to-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">📅</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Date & Time</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {transaction.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-13">
              {transaction.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-gray-900 dark:to-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💳</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Transaction Type</p>
                <p className="font-semibold text-gray-900 dark:text-white capitalize">
                  {transaction.type}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-13">
              {transaction.status === 'completed' ? 'Successfully processed' : transaction.status === 'pending' ? 'Processing...' : 'Transaction failed'}
            </p>
          </div>

          {transaction.recipient && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Recipient</p>
                  <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {transaction.recipient}
                  </p>
                </div>
              </div>
            </div>
          )}

          {transaction.sender && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sender</p>
                  <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {transaction.sender}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {transaction.note && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-xl mb-8">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Note</p>
                <p className="text-gray-700 dark:text-gray-300">{transaction.note}</p>
              </div>
            </div>
          </div>
        )}

        {/* Amount Breakdown */}
        <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 rounded-2xl p-6 mb-8 border-2 border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-2xl">💰</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payment Breakdown</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">📊</span>
                <span className="text-gray-700 dark:text-gray-300">Base Amount</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-lg">
                {transaction.currency} {transaction.amount.toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✨</span>
                <span className="text-gray-700 dark:text-gray-300">Service Fee (0.1%)</span>
              </div>
              <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                {transaction.currency} {transaction.fee.toFixed(2)}
              </span>
            </div>

            {transaction.toAmount && transaction.toCurrency && (
              <div className="flex justify-between items-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-2">
                  <span className="text-purple-500">🔄</span>
                  <span className="text-gray-700 dark:text-gray-300">Converted Amount</span>
                </div>
                <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">
                  {transaction.toCurrency} {transaction.toAmount.toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl text-white shadow-lg mt-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <span className="font-bold text-lg">Total Paid</span>
              </div>
              <span className="font-bold text-2xl">
                {transaction.currency} {(transaction.amount + transaction.fee).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Hash */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔐</span>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Transaction Hash</p>
          </div>
          <div className="bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-900/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <code className="flex-1 font-mono text-xs text-gray-900 dark:text-white break-all">
                {transaction.transactionHash}
              </code>
              <button
                onClick={copyToClipboard}
                className="flex-shrink-0 p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
                title="Copy hash"
              >
                <span className="text-xl">📋</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-l-4 border-green-500 p-4 rounded-r-xl mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">✓</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Verified Transaction</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This transaction has been verified and recorded on the SwiftMint blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white rounded-full text-sm font-semibold">
              <span>⚡</span>
              <span>SwiftMint - Instant Global Micro-Payments</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <span>💸</span>
              <span>Ultra-low fees</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>⚡</span>
              <span>Instant transfers</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>🌍</span>
              <span>18+ currencies</span>
            </span>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-600 space-y-1">
            <p>This is an official receipt from SwiftMint.</p>
            <p>Keep this for your records. Transaction ID: {transaction.id}</p>
            <p className="font-mono text-xs mt-2">Generated on {new Date().toLocaleString()}</p>
          </div>
        </div>
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
