import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const QRPayment: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'generate' | 'scan'>('generate');
  const [generateForm, setGenerateForm] = useState({
    amount: '',
    currency: 'USD',
    note: '',
  });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [scanFile, setScanFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateQR = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In production, use a QR code library to generate the actual QR code
    // For now, we'll create a mock QR code representation
    const qrCodeString = `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="black"/>
        <rect x="30" y="30" width="140" height="140" fill="white"/>
        <text x="100" y="100" text-anchor="middle" font-size="12" fill="black">SwiftMint QR</text>
        <text x="100" y="120" text-anchor="middle" font-size="10" fill="black">${generateForm.currency} ${generateForm.amount}</text>
      </svg>
    `)}`;

    setQrCode(qrCodeString);
    
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'QR code generated successfully!',
    });
  };

  const handleScanQR = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scanFile) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Please select a QR code image',
      });
      return;
    }

    // Mock QR scan - in production, use a QR scanner library
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'QR code scanned! Redirecting to payment...',
    });

    // Simulate redirect to send page with pre-filled data
    setTimeout(() => {
      navigate('/send');
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScanFile(e.target.files[0]);
    }
  };

  const downloadQR = () => {
    if (!qrCode) return;

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `swiftmint-qr-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification({
      type: 'success',
      title: 'Success',
      message: 'QR code downloaded!',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">QR Code Payments</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate or scan QR codes for instant payments</p>
      </div>

      {/* Tabs */}
      <div className="card p-0">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'generate'
                ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            📱 Generate QR Code
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'scan'
                ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            📸 Scan QR Code
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'generate' ? (
            <div className="space-y-6">
              <form onSubmit={handleGenerateQR} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={generateForm.amount}
                      onChange={(e) => setGenerateForm({ ...generateForm, amount: e.target.value })}
                      placeholder="100.00"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={generateForm.currency}
                      onChange={(e) => setGenerateForm({ ...generateForm, currency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="USD">USD - US Dollar ($)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                      <option value="JPY">JPY - Japanese Yen (¥)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={generateForm.note}
                    onChange={(e) => setGenerateForm({ ...generateForm, note: e.target.value })}
                    placeholder="Payment description"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <button type="submit" className="w-full btn-primary">
                  Generate QR Code
                </button>
              </form>

              {qrCode && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg shadow-lg">
                      <img src={qrCode} alt="Payment QR Code" className="w-64 h-64" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      Scan this QR code to receive {generateForm.currency} {generateForm.amount}
                    </p>
                    <button
                      onClick={downloadQR}
                      className="btn-secondary"
                    >
                      📥 Download QR Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleScanQR} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload QR Code Image
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 transition-colors text-gray-600 dark:text-gray-400"
                  >
                    {scanFile ? (
                      <div>
                        <p className="font-medium">📎 {scanFile.name}</p>
                        <p className="text-sm mt-1">Click to change file</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">📸 Click to upload QR code</p>
                        <p className="text-sm mt-1">or drag and drop</p>
                      </div>
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!scanFile}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Scan & Pay
                </button>
              </form>

              <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 How to use</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
                  <li>Upload a SwiftMint QR code image</li>
                  <li>We'll decode the payment details automatically</li>
                  <li>Review and confirm the payment</li>
                  <li>Transaction completes instantly</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">✅ Secure & Fast</h3>
        <p className="text-sm text-green-800 dark:text-green-400">
          QR code payments are encrypted and processed instantly. No need to share wallet IDs manually!
        </p>
      </div>
    </div>
  );
};

export default QRPayment;
