import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useStreamTipping } from '../hooks/useStreamTipping';
import { useEVVM } from '../hooks/useEVVM';

const Leaderboard = () => {
  const { provider, signer, account } = useWeb3();
  const { streamTippingContract } = useStreamTipping();
  const { getUsernameByAddress } = useEVVM(provider, signer, account);
  
  const [topCreators, setTopCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTopCreators = async () => {
      // In a real implementation, you'd query events or use a subgraph
      // For now, we'll show mock data
      const mockCreators = [
        { address: '0x1234...5678', username: 'cryptoking', totalTips: '2.5', tipCount: 45 },
        { address: '0x8765...4321', username: 'streamqueen', totalTips: '1.8', tipCount: 32 },
        { address: '0xabcd...efgh', username: 'gamerpro', totalTips: '1.2', tipCount: 28 },
        { address: '0x9876...1234', username: 'musiclover', totalTips: '0.9', tipCount: 19 },
        { address: '0x5555...6666', username: 'artcreator', totalTips: '0.7', tipCount: 15 },
      ];
      
      setTopCreators(mockCreators);
      setIsLoading(false);
    };

    loadTopCreators();
  }, [streamTippingContract]);

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🏅';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🏆</span>
        <h3 className="text-xl font-bold text-white">Top Creators</h3>
        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">This Week</span>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-white/50 mt-2">Loading leaderboard...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {topCreators.map((creator, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg transition-all hover:scale-102 ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                  : 'bg-white/5 border border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getMedalEmoji(index)}</span>
                <div>
                  <p className="text-white font-semibold">
                    {creator.username ? `@${creator.username}` : creator.address}
                  </p>
                  <p className="text-white/50 text-xs">{creator.tipCount} tips received</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{creator.totalTips} ETH</p>
                <p className="text-green-400 text-xs">+{(Math.random() * 20).toFixed(1)}% ↗</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <p className="text-purple-300 text-sm text-center">
          💡 Tip creators to help them climb the leaderboard!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
