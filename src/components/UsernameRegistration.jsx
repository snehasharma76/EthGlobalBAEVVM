import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useEVVM } from '../hooks/useEVVM';

const UsernameRegistration = () => {
  const { account, isConnected, provider, signer } = useWeb3();
  const { getUsernameByAddress, nameServiceContract } = useEVVM(provider, signer, account);
  
  const [username, setUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadUsername = async () => {
      if (account) {
        const name = await getUsernameByAddress(account);
        setCurrentUsername(name);
      }
    };
    loadUsername();
  }, [account, getUsernameByAddress]);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real implementation, you'd call the MATE Name Service contract
      // For now, we'll show a message about MATE tokens being required
      setError('MATE Name Service requires MATE tokens. Get MATE tokens from EVVM faucet first!');
      
      // Example of what the real implementation would look like:
      // const tx = await nameServiceContract.registrationUsername(
      //   account,
      //   username,
      //   0, // clowNumber
      //   nonce,
      //   signature
      // );
      // await tx.wait();
      // setSuccess(`Username "${username}" registered successfully!`);
      
    } catch (err) {
      setError(err.message || 'Failed to register username');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <p className="text-white/70 text-center">Connect your wallet to register a username</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">👤</span>
        <h3 className="text-xl font-bold text-white">MATE Username</h3>
        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">Name Service</span>
      </div>

      {currentUsername ? (
        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
          <p className="text-green-300 text-sm mb-2">Your registered username:</p>
          <p className="text-white font-bold text-lg">@{currentUsername}</p>
        </div>
      ) : (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
          <p className="text-yellow-300 text-sm">No username registered yet</p>
        </div>
      )}

      {!currentUsername && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-white/70 mb-2 text-sm">Choose Your Username</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-white/50">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="yourname"
                className="w-full bg-white/10 text-white border border-white/20 pl-8 pr-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                maxLength={20}
              />
            </div>
            <p className="text-white/50 text-xs mt-1">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registering...' : 'Register Username'}
          </button>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-300 text-xs">
              <strong>Note:</strong> Username registration requires MATE tokens and interacts with EVVM Name Service contract.
              Once registered, your username will be displayed across the platform instead of your wallet address.
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default UsernameRegistration;
