import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import WalletConnect from './WalletConnect';

const HomePage = () => {
  const navigate = useNavigate();
  const { isConnected } = useWeb3();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <nav className="w-full p-4 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Chiliz Maxxing</h1>
          <WalletConnect />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Decentralized Live Streaming Platform
          </h2>
          <p className="text-xl text-white/70 mb-2">
            Stream, Watch, and Tip Creators on EVVM Blockchain
          </p>
          <p className="text-sm text-white/50">
            Powered by MATE Metaprotocol with x402 Autonomous Agents
          </p>
        </div>

        {!isConnected ? (
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
            <p className="text-white/70 mb-6">
              Connect your wallet to start streaming or watching live content
            </p>
            <WalletConnect />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-8 hover:border-purple-500/50 transition-all cursor-pointer"
                 onClick={() => navigate('/browse')}>
              <div className="flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-6">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Watch Streams</h3>
              <p className="text-white/70 mb-6">
                Browse live streams and tip your favorite creators with crypto
              </p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors">
                Browse Streams
              </button>
            </div>

            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-md rounded-xl border border-orange-500/30 p-8 hover:border-orange-500/50 transition-all cursor-pointer"
                 onClick={() => navigate('/creator-dashboard')}>
              <div className="flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-6">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Start Streaming</h3>
              <p className="text-white/70 mb-6">
                Go live, build your audience, and earn tips from your fans
              </p>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors">
                Creator Dashboard
              </button>
            </div>
          </div>
        )}

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Instant Tips</h4>
            <p className="text-white/60 text-sm">
              Send tips directly to creators with async nonces for parallel transactions
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Decentralized</h4>
            <p className="text-white/60 text-sm">
              Built on EVVM blockchain with MATE Metaprotocol integration
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">x402 Agents</h4>
            <p className="text-white/60 text-sm">
              Autonomous agents monitor tips, distribute rewards, and manage names
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
