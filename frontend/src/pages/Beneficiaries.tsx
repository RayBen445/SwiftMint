import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Beneficiary {
  id: string;
  name: string;
  walletId: string;
  nickname?: string;
  currency: string;
  lastUsed?: Date;
  favorite: boolean;
}

const Beneficiaries: React.FC = () => {
  const navigate = useNavigate();
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: '1',
      name: 'John Doe',
      walletId: 'wallet_john123',
      nickname: 'Work Partner',
      currency: 'USD',
      lastUsed: new Date('2024-01-15'),
      favorite: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      walletId: 'wallet_jane456',
      nickname: 'Freelancer',
      currency: 'EUR',
      lastUsed: new Date('2024-01-10'),
      favorite: false,
    },
    {
      id: '3',
      name: 'Bob Johnson',
      walletId: 'wallet_bob789',
      currency: 'GBP',
      lastUsed: new Date('2024-01-05'),
      favorite: false,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: '',
    walletId: '',
    nickname: '',
    currency: 'USD',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);

  const filteredBeneficiaries = beneficiaries.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.walletId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.nickname && b.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFavorite = !filterFavorites || b.favorite;
    return matchesSearch && matchesFavorite;
  });

  const toggleFavorite = (id: string) => {
    setBeneficiaries((prev) =>
      prev.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b))
    );
  };

  const removeBeneficiary = (id: string) => {
    if (confirm('Are you sure you want to remove this beneficiary?')) {
      setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleAddBeneficiary = () => {
    if (!newBeneficiary.name || !newBeneficiary.walletId) {
      alert('Please fill in all required fields');
      return;
    }

    const beneficiary: Beneficiary = {
      id: Date.now().toString(),
      name: newBeneficiary.name,
      walletId: newBeneficiary.walletId,
      nickname: newBeneficiary.nickname || undefined,
      currency: newBeneficiary.currency,
      favorite: false,
    };

    setBeneficiaries((prev) => [beneficiary, ...prev]);
    setShowAddModal(false);
    setNewBeneficiary({ name: '', walletId: '', nickname: '', currency: 'USD' });
  };

  const sendToBeneficiary = (beneficiary: Beneficiary) => {
    navigate('/send', { state: { recipientWalletId: beneficiary.walletId } });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Beneficiaries</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your saved contacts for faster payments
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors"
        >
          + Add Beneficiary
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, wallet ID, or nickname..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterFavorites
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ⭐ Favorites {filterFavorites && `(${beneficiaries.filter((b) => b.favorite).length})`}
          </button>
        </div>
      </div>

      {/* Beneficiaries List */}
      {filteredBeneficiaries.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || filterFavorites ? 'No beneficiaries found' : 'No beneficiaries yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || filterFavorites
              ? 'Try adjusting your search or filters'
              : 'Add beneficiaries to send money faster'}
          </p>
          {!searchTerm && !filterFavorites && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-600 transition-colors"
            >
              Add Your First Beneficiary
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBeneficiaries.map((beneficiary) => (
            <div
              key={beneficiary.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {beneficiary.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {beneficiary.name}
                      </h3>
                      {beneficiary.favorite && <span className="text-yellow-500">⭐</span>}
                    </div>
                    {beneficiary.nickname && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {beneficiary.nickname}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">
                      {beneficiary.walletId}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {beneficiary.currency}
                      </span>
                      {beneficiary.lastUsed && (
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          Last used: {beneficiary.lastUsed.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(beneficiary.id)}
                    className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                    title={beneficiary.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {beneficiary.favorite ? '⭐' : '☆'}
                  </button>
                  <button
                    onClick={() => sendToBeneficiary(beneficiary)}
                    className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    Send Money
                  </button>
                  <button
                    onClick={() => removeBeneficiary(beneficiary.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove beneficiary"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Beneficiary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Beneficiary</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newBeneficiary.name}
                  onChange={(e) =>
                    setNewBeneficiary((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Wallet ID *
                </label>
                <input
                  type="text"
                  value={newBeneficiary.walletId}
                  onChange={(e) =>
                    setNewBeneficiary((prev) => ({ ...prev, walletId: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                  placeholder="wallet_abc123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={newBeneficiary.nickname}
                  onChange={(e) =>
                    setNewBeneficiary((prev) => ({ ...prev, nickname: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Work Partner, Family, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Currency
                </label>
                <select
                  value={newBeneficiary.currency}
                  onChange={(e) =>
                    setNewBeneficiary((prev) => ({ ...prev, currency: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="JPY">JPY - Japanese Yen (¥)</option>
                  <option value="CAD">CAD - Canadian Dollar ($)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBeneficiary}
                className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                Add Beneficiary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beneficiaries;
