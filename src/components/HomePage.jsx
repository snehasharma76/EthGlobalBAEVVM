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
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎬</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">StreamIt</h1>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">EVVM</span>
          </div>
          <WalletConnect />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Decentralized Live Streaming Platform ✨
          </h2>
          <p className="text-xl text-white/70 mb-2">
            Stream, Watch, and Tip Creators on EVVM Blockchain 🚀
          </p>
          <p className="text-sm text-white/50">
            Powered by MATE Metaprotocol with x402 Autonomous Agents 🤖
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
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-xl border border-purple-500/30 p-8 hover:border-purple-500/50 hover:scale-105 transition-all cursor-pointer group"
                 onClick={() => navigate('/browse')}>
              <div className="flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">📺</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Watch Streams 👀</h3>
              <p className="text-white/70 mb-6">
                Browse live streams and tip your favorite creators with crypto 💰
              </p>
              <div className="flex items-center gap-2 text-sm text-purple-300 mb-4">
                <span className="bg-purple-500/20 px-2 py-1 rounded">🔴 Live Now</span>
                <span className="bg-purple-500/20 px-2 py-1 rounded">⚡ Instant Tips</span>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                Browse Streams →
              </button>
            </div>

            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-md rounded-xl border border-orange-500/30 p-8 hover:border-orange-500/50 hover:scale-105 transition-all cursor-pointer group"
                 onClick={() => navigate('/creator-dashboard')}>
              <div className="flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">🎥</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Start Streaming 🚀</h3>
              <p className="text-white/70 mb-6">
                Go live, build your audience, and earn tips from your fans 🌟
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-300 mb-4">
                <span className="bg-orange-500/20 px-2 py-1 rounded">💎 Earn MATE</span>
                <span className="bg-orange-500/20 px-2 py-1 rounded">🎬 HD Quality</span>
              </div>
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                Creator Dashboard →
              </button>
            </div>
          </div>
        )}

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center hover:scale-105 transition-transform">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Instant Tips ⚡</h4>
            <p className="text-white/60 text-sm">
              Send tips directly to creators with async nonces for parallel transactions
            </p>
          </div>

          <div className="text-center hover:scale-105 transition-transform">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Decentralized 🔒</h4>
            <p className="text-white/60 text-sm">
              Built on EVVM blockchain with MATE Metaprotocol integration
            </p>
          </div>

          <div className="text-center hover:scale-105 transition-transform">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">x402 Agents 🤖</h4>
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
