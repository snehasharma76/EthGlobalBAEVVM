import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import { useStreamTipping } from '../hooks/useStreamTipping';
import { useMATEServices } from '../hooks/useMATEServices';

const TipContract = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { account, isConnected, connectWallet, chainId, switchNetwork } = useWeb3();
  const { sendTip, getCreatorStats, isLoading: tippingLoading } = useStreamTipping();
  const { getName, isLoading: mateLoading } = useMATEServices();

  const [tipAmount, setTipAmount] = useState('0.01');
  const [tipMessage, setTipMessage] = useState('');
  const [creatorStats, setCreatorStats] = useState(null);
  const [creatorName, setCreatorName] = useState('');
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [error, setError] = useState('');

  const creatorAddress = location.state?.creatorAddress || '';
  const creatorDisplayName = location.state?.creatorName || 'Creator';
  const roomID = location.state?.roomID || '';

  useEffect(() => {
    const loadCreatorData = async () => {
      if (!creatorAddress) return;

      try {
        const stats = await getCreatorStats(creatorAddress);
        setCreatorStats(stats);

        try {
          const name = await getName(creatorAddress);
          if (name) {
            setCreatorName(name);
          }
        } catch (err) {
          console.log('No MATE name registered for creator');
        }
      } catch (err) {
        console.error('Error loading creator data:', err);
      }
    };

    loadCreatorData();
  }, [creatorAddress, getCreatorStats, getName]);

  const handleConnectWallet = async () => {
    try {
      setError('');
      await connectWallet();
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
    }
  };

  const handleNetworkSwitch = async () => {
    try {
      setError('');
      await switchNetwork(11155111);
    } catch (err) {
      setError('Failed to switch network: ' + err.message);
    }
  };

  const handleSendTip = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!creatorAddress) {
      setError('Creator address not found');
      return;
    }

    if (chainId !== 11155111) {
      setError('Please switch to Sepolia network');
      return;
    }

    const amount = parseFloat(tipAmount);
    if (isNaN(amount) || amount < 0.001) {
      setError('Minimum tip amount is 0.001 ETH');
      return;
    }

    try {
      setError('');
      setTxStatus('Preparing transaction...');
      setTxHash('');

      const result = await sendTip(creatorAddress, amount, tipMessage);

      setTxHash(result.transactionHash);
      setTxStatus('Transaction confirmed!');
      setTipMessage('');

      const updatedStats = await getCreatorStats(creatorAddress);
      setCreatorStats(updatedStats);

      setTimeout(() => {
        setTxStatus('');
      }, 5000);
    } catch (err) {
      console.error('Error sending tip:', err);
      setError('Failed to send tip: ' + err.message);
      setTxStatus('');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const isWrongNetwork = isConnected && chainId !== 11155111;
  const isLoading = tippingLoading || mateLoading;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Tip Creator</h2>
            <button
              onClick={handleBack}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-white/70 mb-6">Connect your wallet to send tips</p>
              <button
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300"
              >
                Connect Wallet
              </button>
            </div>
          ) : isWrongNetwork ? (
            <div className="text-center py-8">
              <p className="text-yellow-400 mb-6">Please switch to Sepolia Testnet</p>
              <button
                onClick={handleNetworkSwitch}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition duration-300"
              >
                Switch Network
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Creator</span>
                  <span className="text-white font-semibold">
                    {creatorName || creatorDisplayName}
                  </span>
                </div>
                {creatorAddress && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Address</span>
                    <span className="text-white/50 text-sm font-mono">
                      {creatorAddress.slice(0, 6)}...{creatorAddress.slice(-4)}
                    </span>
                  </div>
                )}
                {creatorStats && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70">Total Tips Received</span>
                      <span className="text-green-400 font-semibold">
                        {parseFloat(creatorStats.totalTips).toFixed(4)} ETH
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Number of Tips</span>
                      <span className="text-white font-semibold">{creatorStats.tipCount}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Your Wallet</span>
                  <span className="text-white/50 text-sm font-mono">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Network</span>
                  <span className="text-green-400 font-semibold">Sepolia Testnet</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-white/70 mb-2 text-sm">Tip Amount (ETH)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="0.01"
                  />
                  <p className="text-white/50 text-xs mt-1">Minimum: 0.001 ETH</p>
                </div>

                <div>
                  <label className="block text-white/70 mb-2 text-sm">Message (Optional)</label>
                  <textarea
                    value={tipMessage}
                    onChange={(e) => setTipMessage(e.target.value)}
                    maxLength={200}
                    rows={3}
                    className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Add a message with your tip..."
                  />
                  <p className="text-white/50 text-xs mt-1">{tipMessage.length}/200 characters</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {txStatus && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <p className="text-green-400 text-sm">{txStatus}</p>
                  {txHash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-xs hover:underline mt-1 block"
                    >
                      View on Etherscan
                    </a>
                  )}
                </div>
              )}

              <button
                onClick={handleSendTip}
                disabled={isLoading || !creatorAddress}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-8 py-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Send Tip
                  </>
                )}
              </button>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Note:</strong> This transaction uses async nonces for parallel execution. 
                  A 2.5% platform fee will be deducted from your tip.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipContract;
