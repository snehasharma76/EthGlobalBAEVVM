import React from 'react';
import { useWeb3 } from '../hooks/useWeb3';

const WalletConnect = () => {
  const { account, isConnected, connectWallet, disconnectWallet, chainId, switchNetwork, isConnecting } = useWeb3();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork(11155111);
    } catch (err) {
      console.error('Failed to switch network:', err);
    }
  };

  const isWrongNetwork = isConnected && chainId !== 11155111;

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-yellow-500/20 border border-yellow-500/50 px-4 py-2 rounded-lg">
          <span className="text-yellow-400 text-sm">Wrong Network</span>
        </div>
        <button
          onClick={handleSwitchNetwork}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition duration-300"
        >
          Switch to Sepolia
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-lg">
        <span className="text-white font-mono text-sm">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
      </div>
      <button
        onClick={handleDisconnect}
        className="bg-red-500/20 border border-red-500/50 text-red-400 font-semibold px-4 py-2 rounded-lg hover:bg-red-500/30 transition duration-300"
      >
        Disconnect
      </button>
    </div>
  );
};

export default WalletConnect;
