import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useStreamTipping } from '../hooks/useStreamTipping';

const CreatorRegistration = () => {
  const { account, isConnected } = useWeb3();
  const { registerAsCreator, isLoading } = useStreamTipping();
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError('');
    setSuccess(false);
    setTxHash('');

    try {
      const result = await registerAsCreator();
      setTxHash(result.transactionHash);
      setSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
        <p className="text-yellow-400">Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">Creator Registration</h3>
      
      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-blue-300 text-sm">
          <strong>Important:</strong> You must register as a creator before you can receive tips.
        </p>
      </div>

      <div className="mb-4">
        <p className="text-white/70 text-sm mb-2">Your Address:</p>
        <p className="text-white font-mono text-sm bg-white/5 p-2 rounded">
          {account}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p className="text-green-400 text-sm mb-2">Successfully registered as creator!</p>
          {txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-xs hover:underline"
            >
              View on Etherscan
            </a>
          )}
        </div>
      )}

      <button
        onClick={handleRegister}
        disabled={isLoading || success}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Registering...' : success ? 'Registered!' : 'Register as Creator'}
      </button>
    </div>
  );
};

export default CreatorRegistration;
