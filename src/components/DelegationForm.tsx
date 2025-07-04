import React, { useState } from 'react';
import { Send, User, Users, Target } from 'lucide-react';
import { useDelegationContract } from '../hooks/useDelegationContract';

interface DelegationFormProps {
  account: string;
  onDelegateToSelf: () => void;
  onDelegateToCustom: (address: string) => void;
  loading: boolean;
}



export const DelegationForm: React.FC<DelegationFormProps> = ({
  account,
  onDelegateToSelf,
  onDelegateToCustom,
  loading,
}) => {
  const [customAddress, setCustomAddress] = useState('');
  const [selectedTab, setSelectedTab] = useState<'self' | 'custom'>('self');

  const handleCustomDelegate = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAddress && customAddress.startsWith('0x') && customAddress.length === 42) {
      onDelegateToCustom(customAddress);
    }
  };

  const isValidAddress = customAddress.startsWith('0x') && customAddress.length === 42;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        Delegate Voting Rights
      </h3>

      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setSelectedTab('self')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            selectedTab === 'self'
              ? 'bg-white text-green-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Revoke Rights
        </button>
        <button
          onClick={() => setSelectedTab('custom')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            selectedTab === 'custom'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Delegate
        </button>
      </div>

      {selectedTab === 'self' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-green-800 font-bold mb-2">Revoke Rights</p>
            <p className="text-green-600 text-sm mb-4">
              Reassign voting rights back to yourself.
            </p>
            <div className="text-sm text-gray-600 mb-4">
              Your address: <span className="font-mono">{account.slice(0, 8)}...{account.slice(-6)}</span>
            </div>
          </div>
          
          <button
            onClick={onDelegateToSelf}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-green-900 hover:from-green-900 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
          >
            {loading ? 'Revoking...' : 'Revoke Rights'}
          </button>
        </div>
      )}

      {selectedTab === 'custom' && (
        <form onSubmit={handleCustomDelegate} className="space-y-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-orange-800 font-medium mb-2">Delegate to Custom Address</p>
            <p className="text-orange-600 text-sm">
              Enter any Ethereum address to delegate your voting rights to that address.
            </p>
          </div>
          
          <div>
            <label htmlFor="customAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Ethereum Address
            </label>
            <input
              type="text"
              id="customAddress"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-mono text-sm"
            />
            {customAddress && !isValidAddress && (
              <p className="text-red-600 text-sm mt-1">Please enter a valid Ethereum address</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!isValidAddress || loading}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-red-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
          >
            {loading ? 'Delegating...' : 'Delegate Rights'}
          </button>
        </form>
      )}
    </div>
  );
};