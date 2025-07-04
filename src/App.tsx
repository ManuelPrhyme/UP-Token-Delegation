import React, { useState } from 'react';
import { Vote, Github, ExternalLink } from 'lucide-react';
import { useWeb3 } from './hooks/useWeb3';
import { useDelegationContract } from './hooks/useDelegationContract';
import { WalletConnection } from './components/WalletConnection';
import { DelegationStats } from './components/DelegationStats';
import { StewardList } from './components/StewardList';
import { DelegationForm } from './components/DelegationForm';
import { CurrentDelegation } from './components/CurrentDelegation';

function App() {
  const {
    account,
    signer,
    isConnecting,
    isConnected,
    isOnBase,
    connectWallet,
    switchToBase,
    disconnect
  } = useWeb3();

  const {
    loading,
    stewards,
    delegationInfo,
    stats,
    delegateToSelf,
    delegateToSteward,
    delegateToCustom,
  } = useDelegationContract(signer);

  const [transactionStatus, setTransactionStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleDelegateToSelf = async () => {
    try {
      await delegateToSelf();
      setTransactionStatus({
        type: 'success',
        message: 'Successfully delegated voting rights to yourself!',
      });
    } catch (error) {
      setTransactionStatus({
        type: 'error',
        message: 'Failed to delegate voting rights. Please try again.',
      });
    }
  };

  const handleDelegateToSteward = async (address: string) => {
    try {
      await delegateToSteward(address);
      setTransactionStatus({
        type: 'success',
        message: 'Successfully delegated voting rights to steward!',
      });
    } catch (error) {
      setTransactionStatus({
        type: 'error',
        message: 'Failed to delegate voting rights. Please try again.',
      });
    }
  };

  const handleDelegateToCustom = async (address: string) => {
    try {
      await delegateToCustom(address);
      setTransactionStatus({
        type: 'success',
        message: 'Successfully delegated voting rights to custom address!',
      });
    } catch (error) {
      setTransactionStatus({
        type: 'error',
        message: 'Failed to delegate voting rights. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Vote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">UP Token Delegation</h1>
                  <p className="text-sm text-gray-600">Unlock Protocol on Base</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
            
            <button
            style={{display: account ? 'flex' : 'none'}}
            onClick={disconnect}
            disabled={isConnecting}
            className="bg-gradient-to-r from-red-600 to-red-900 hover:from-red-900 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            {!isConnecting ? 'Disconnect' : 'Disconnecting...'}
            </button>

              <button
              style={{display: !account ? 'flex' : 'none'}}
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-green-600 to-green-900 hover:from-green-900 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
              
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Delegate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">Voting Power</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
         Engage in Unlock Protocol governance by delegating votes to stewards, yourself, or a custom Base address.
          </p>
        </div>

        {/* Transaction Status */}
        {transactionStatus.type && (
          <div className={`mb-8 p-4 rounded-lg ${
            transactionStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="font-medium">{transactionStatus.message}</p>
            <button
              onClick={() => setTransactionStatus({ type: null, message: '' })}
              className="text-sm underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnection
            account={account}
            isConnecting={isConnecting}
            isOnBase={isOnBase}
            connectWallet={connectWallet}
            switchToBase={switchToBase}
          />
        </div>

        {isConnected && isOnBase && (
          <>
            {/* Delegation Statistics */}
            {/* <div className="mb-8">
              <DelegationStats stats={stats} loading={loading} />
            </div> */}

            {/* Current Delegation Status */}
            {/* <div className="mb-8">
              <CurrentDelegation
                delegationInfo={delegationInfo}
                loading={loading}
                account={account!}
              />
            </div> */}

            {/* Delegation Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
              {/* Self/Custom Delegation */}
              <DelegationForm
                account={account!}
                onDelegateToSelf={handleDelegateToSelf}
                onDelegateToCustom={handleDelegateToCustom}
                loading={loading}
              />

            </div>
          </>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200 mt-16">
          <p className="text-sm text-gray-500 mt-2">
          Built by <span className="text-orange-700 font-bold">Emmanuel Bagoole</span>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;