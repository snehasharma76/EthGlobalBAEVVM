import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import { useStreamTipping } from '../hooks/useStreamTipping';
import WalletConnect from './WalletConnect';

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const { account, isConnected } = useWeb3();
  const { registerAsCreator, getCreatorStats, isLoading } = useStreamTipping();
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [stats, setStats] = useState(null);
  const [roomID, setRoomID] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkRegistration = async () => {
      if (!account) return;
      
      try {
        const creatorStats = await getCreatorStats(account);
        setIsRegistered(creatorStats.isActive);
        setStats(creatorStats);
      } catch (err) {
        console.error('Error checking registration:', err);
      }
    };

    checkRegistration();
  }, [account, getCreatorStats]);

  const handleRegister = async () => {
    setError('');
    try {
      await registerAsCreator();
      setIsRegistered(true);
      const creatorStats = await getCreatorStats(account);
      setStats(creatorStats);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoLive = () => {
    if (!roomID) {
      setError('Please enter a room ID');
      return;
    }
    navigate('/stream', { state: { roomID, userID: account.slice(0, 10) } });
  };

  const generateRoomID = () => {
    const randomID = 'stream-' + Math.random().toString(36).substr(2, 9);
    setRoomID(randomID);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <nav className="w-full p-4 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-white">Creator Dashboard</h1>
          </div>
          <WalletConnect />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Connect Wallet</h3>
            <p className="text-white/70 mb-6">
              Connect your wallet to access the creator dashboard
            </p>
            <WalletConnect />
          </div>
        ) : !isRegistered ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Register as Creator</h3>
                <p className="text-white/70 mb-6">
                  Register on-chain to start streaming and receive tips
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <h4 className="text-white font-semibold mb-2">Creator Benefits:</h4>
                <ul className="text-white/70 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Receive instant tips from viewers
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Track earnings and statistics
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Only 2.5% platform fee
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Decentralized and censorship-resistant
                  </li>
                </ul>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold py-4 rounded-lg hover:from-orange-700 hover:to-red-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Registering...' : 'Register as Creator (Free)'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Go Live</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 mb-2 text-sm">Room ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={roomID}
                        onChange={(e) => setRoomID(e.target.value)}
                        placeholder="Enter or generate a room ID"
                        className="flex-1 bg-white/10 text-white placeholder-white/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                      />
                      <button
                        onClick={generateRoomID}
                        className="px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleGoLive}
                    disabled={!roomID}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-4 rounded-lg hover:from-red-700 hover:to-pink-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    Start Streaming
                  </button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Tips</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Share your Room ID with viewers to let them join
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Viewers can tip you directly during the stream
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    Tips are sent instantly to your wallet (minus 2.5% fee)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    All transactions are recorded on the blockchain
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-xl border border-green-500/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Total Tips Received</p>
                    <p className="text-2xl font-bold text-green-400">
                      {stats ? parseFloat(stats.totalTips).toFixed(4) : '0.0000'} ETH
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">Number of Tips</p>
                    <p className="text-2xl font-bold text-white">
                      {stats ? stats.tipCount : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm mb-1">Status</p>
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
                      Active Creator
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Wallet</h3>
                <p className="text-white/70 text-xs mb-2">Address</p>
                <p className="text-white font-mono text-sm bg-white/5 p-2 rounded break-all">
                  {account}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
