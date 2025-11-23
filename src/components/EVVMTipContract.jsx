import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import { useEVVM } from '../hooks/useEVVM';
import { TOKEN_ADDRESSES } from '../config/contracts';

const EVVMTipContract = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { account, isConnected, connectWallet, chainId, switchNetwork, provider, signer } = useWeb3();
  const { 
    sendPayment, 
    getBalances, 
    getUsernameByAddress, 
    checkStakerStatus,
    isLoading 
  } = useEVVM(provider, signer, account);

  const [tipAmount, setTipAmount] = useState('0.01');
  const [tipMessage, setTipMessage] = useState('');
  const [priorityFee, setPriorityFee] = useState('0');
  const [useAsyncNonce, setUseAsyncNonce] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState('');
  const [balances, setBalances] = useState(null);
  const [isStaker, setIsStaker] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [error, setError] = useState('');

  const creatorAddress = location.state?.creatorAddress || '';
  const creatorDisplayName = location.state?.creatorName || 'Creator';

  useEffect(() => {
    const loadData = async () => {
      if (!account) return;

      try {
        const bals = await getBalances(account);
        setBalances(bals);

        const stakerStatus = await checkStakerStatus(account);
        setIsStaker(stakerStatus);
      } catch (err) {
        console.error('Error loading user data:', err);
      }

      if (creatorAddress) {
        try {
          const username = await getUsernameByAddress(creatorAddress);
          if (username) setCreatorUsername(username);
        } catch (err) {
          console.log('No username for creator');
        }
      }
    };

    loadData();
  }, [account, creatorAddress, getBalances, checkStakerStatus, getUsernameByAddress]);

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
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid tip amount');
      return;
    }

    try {
      setError('');
      setTxStatus('Signing transaction with EIP-191...');
      setTxHash('');

      const result = await sendPayment({
        to_address: creatorAddress,
        to_identity: creatorUsername || '',
        token: TOKEN_ADDRESSES.mate,
        amount: tipAmount,
        priorityFee: priorityFee || '0',
        priorityFlag: useAsyncNonce,
        executor: '0x0000000000000000000000000000000000000000'
      });

      setTxHash(result.transactionHash);
      setTxStatus('Tip sent successfully via EVVM!');
      setTipMessage('');

      setTimeout(async () => {
        const bals = await getBalances(account);
        setBalances(bals);
      }, 2000);

    } catch (err) {
      console.error('Error sending tip:', err);
      setError(err.message || 'Failed to send tip');
      setTxStatus('');
    }
  };

  const isWrongNetwork = isConnected && chainId !== 11155111;

  if (!creatorAddress) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Creator Selected</h2>
          <p className="text-white/70 mb-6">Please select a creator to tip</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Browse Streams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Tip Creator (EVVM)</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-white/70 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Creator Info */}
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">Creator</span>
            <span className="text-white font-semibold">
              {creatorUsername || creatorDisplayName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Address</span>
            <span className="text-white/90 font-mono text-sm">
              {creatorAddress.slice(0, 6)}...{creatorAddress.slice(-4)}
            </span>
          </div>
        </div>

        {/* Wallet Status */}
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">Your Wallet</span>
            <span className="text-white/90 font-mono text-sm">
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">Network</span>
            <span className={`text-sm font-semibold ${isWrongNetwork ? 'text-red-400' : 'text-green-400'}`}>
              {chainId === 11155111 ? 'Sepolia Testnet' : 'Wrong Network'}
            </span>
          </div>
          {balances && (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-sm">MATE Balance</span>
                <span className="text-white font-semibold">{parseFloat(balances.mate).toFixed(4)} MATE</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70 text-sm">Reward Balance</span>
                <span className="text-green-400 font-semibold">{parseFloat(balances.rewards).toFixed(4)} MATE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Staker Status</span>
                <span className={`text-sm font-semibold ${isStaker ? 'text-green-400' : 'text-white/50'}`}>
                  {isStaker ? '✓ Staker' : 'Not Staker'}
                </span>
              </div>
            </>
          )}
        </div>

        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-300"
          >
            Connect Wallet
          </button>
        ) : isWrongNetwork ? (
          <button
            onClick={() => switchNetwork(11155111)}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold py-4 rounded-lg hover:from-orange-700 hover:to-red-700 transition duration-300"
          >
            Switch to Sepolia
          </button>
        ) : (
          <>
            {/* Tip Amount */}
            <div className="mb-4">
              <label className="block text-white/70 mb-2 text-sm">Tip Amount (MATE)</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="0.01"
              />
            </div>

            {/* Priority Fee */}
            <div className="mb-4">
              <label className="block text-white/70 mb-2 text-sm">
                Priority Fee (Optional - goes to fisher)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={priorityFee}
                onChange={(e) => setPriorityFee(e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
                placeholder="0"
              />
            </div>

            {/* Async Nonce Option */}
            <div className="mb-4">
              <label className="flex items-center text-white/70 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAsyncNonce}
                  onChange={(e) => setUseAsyncNonce(e.target.checked)}
                  className="mr-2"
                />
                Use Async Nonce (for parallel transactions)
              </label>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-white/70 mb-2 text-sm">Message (Optional)</label>
              <textarea
                value={tipMessage}
                onChange={(e) => setTipMessage(e.target.value)}
                maxLength={200}
                rows={3}
                className="w-full bg-white/10 text-white border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                placeholder="Add a message with your tip..."
              />
              <p className="text-white/50 text-xs mt-1">{tipMessage.length}/200 characters</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {txStatus && (
              <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <p className="text-blue-400 text-sm">{txStatus}</p>
                {txHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 text-xs hover:underline mt-2 block"
                  >
                    View on Etherscan
                  </a>
                )}
              </div>
            )}

            <button
              onClick={handleSendTip}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-semibold py-4 rounded-lg hover:from-orange-700 hover:to-yellow-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  <span>💰</span>
                  Send Tip via EVVM
                </>
              )}
            </button>

            {balances && parseFloat(balances.mate) === 0 && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <p className="text-yellow-300 text-sm font-semibold mb-2">⚠️ No MATE Tokens</p>
                <p className="text-yellow-200 text-xs">
                  You need MATE tokens to use EVVM payments. MATE is the native token of the EVVM virtual blockchain.
                  Contact the EVVM team or use the testnet faucet to get MATE tokens.
                </p>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-xs">
                <strong>EVVM Payment:</strong> This transaction uses EIP-191 signatures and can be processed by fishers (x402 agents) for gasless execution. {isStaker && 'As a staker, you receive enhanced rewards!'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EVVMTipContract;
