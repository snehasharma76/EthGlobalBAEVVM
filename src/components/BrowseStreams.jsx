import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import WalletConnect from './WalletConnect';

const BrowseStreams = () => {
  const navigate = useNavigate();
  const { isConnected } = useWeb3();
  const [roomID, setRoomID] = useState('');
  const [userID, setUserID] = useState('');

  const handleJoinStream = () => {
    if (roomID && userID) {
      navigate('/stream', { state: { roomID, userID } });
    }
  };

  const mockStreams = [
    {
      id: 'gaming-stream-1',
      title: 'Epic Gaming Session',
      creator: 'ProGamer',
      viewers: 1234,
      category: 'Gaming',
      thumbnail: '🎮'
    },
    {
      id: 'music-live-1',
      title: 'Live Music Performance',
      creator: 'MusicMaster',
      viewers: 856,
      category: 'Music',
      thumbnail: '🎵'
    },
    {
      id: 'tech-talk-1',
      title: 'Web3 Development Tutorial',
      creator: 'DevGuru',
      viewers: 432,
      category: 'Education',
      thumbnail: '💻'
    }
  ];

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
            <h1 className="text-2xl font-bold text-white">Browse Streams</h1>
          </div>
          <WalletConnect />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Connect Wallet to Watch</h3>
            <p className="text-white/70 mb-6">
              Connect your wallet to watch streams and tip creators
            </p>
            <WalletConnect />
          </div>
        ) : (
          <>
            <div className="mb-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Join a Specific Stream</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={roomID}
                  onChange={(e) => setRoomID(e.target.value)}
                  className="bg-white/10 text-white placeholder-white/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="Your Username"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
                  className="bg-white/10 text-white placeholder-white/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleJoinStream}
                  disabled={!roomID || !userID}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join Stream
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-4">Live Now</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {mockStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer"
                    onClick={() => {
                      setRoomID(stream.id);
                      setUserID('viewer-' + Math.random().toString(36).substr(2, 9));
                    }}
                  >
                    <div className="aspect-video bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center text-6xl">
                      {stream.thumbnail}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                          LIVE
                        </span>
                        <span className="text-white/70 text-sm flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                          </svg>
                          {stream.viewers}
                        </span>
                      </div>
                      <h4 className="text-white font-semibold mb-1">{stream.title}</h4>
                      <p className="text-white/70 text-sm mb-2">{stream.creator}</p>
                      <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                        {stream.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-white font-semibold mb-2">How to Watch</h4>
              <ol className="text-white/70 text-sm space-y-2">
                <li>1. Click on a live stream or enter a Room ID</li>
                <li>2. Join the stream with your username</li>
                <li>3. Watch and interact with the creator</li>
                <li>4. Send tips to support your favorite creators</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseStreams;
