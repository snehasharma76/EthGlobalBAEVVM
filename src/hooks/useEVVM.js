import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContractAddress, TOKEN_ADDRESSES } from '../config/contracts';
import { EVVM_ABI, NAME_SERVICE_ABI, STAKING_ABI } from '../config/evvmAbis';

export const useEVVM = (provider, signer, account) => {
  const [evvmContract, setEvvmContract] = useState(null);
  const [nameServiceContract, setNameServiceContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize contracts
  useEffect(() => {
    if (!provider) return;

    try {
      const evvmAddress = getContractAddress('evvm');
      const nameServiceAddress = getContractAddress('nameService');
      const stakingAddress = getContractAddress('staking');

      const evvm = new ethers.Contract(evvmAddress, EVVM_ABI, signer || provider);
      const nameService = new ethers.Contract(nameServiceAddress, NAME_SERVICE_ABI, signer || provider);
      const staking = new ethers.Contract(stakingAddress, STAKING_ABI, signer || provider);

      setEvvmContract(evvm);
      setNameServiceContract(nameService);
      setStakingContract(staking);
    } catch (err) {
      console.error('Error initializing EVVM contracts:', err);
      setError(err.message);
    }
  }, [provider, signer]);

  // Get user balances
  const getBalances = useCallback(async (userAddress) => {
    if (!evvmContract || !userAddress) return null;

    try {
      const mateBalance = await evvmContract.principalBalances(userAddress, TOKEN_ADDRESSES.mate);
      const ethBalance = await evvmContract.principalBalances(userAddress, TOKEN_ADDRESSES.eth);
      const rewardBalance = await evvmContract.rewardBalances(userAddress);

      return {
        mate: ethers.formatEther(mateBalance),
        eth: ethers.formatEther(ethBalance),
        rewards: ethers.formatEther(rewardBalance)
      };
    } catch (err) {
      // Return zero balances if user doesn't exist in EVVM yet
      return {
        mate: '0',
        eth: '0',
        rewards: '0'
      };
    }
  }, [evvmContract]);

  // Get user nonces
  const getNonces = useCallback(async (userAddress) => {
    if (!evvmContract || !userAddress) return null;

    try {
      const syncNonce = await evvmContract.nextSyncUsedNonce(userAddress);
      
      return {
        sync: syncNonce.toString(),
        async: Date.now() // Generate unique async nonce
      };
    } catch (err) {
      // Return default nonces if user doesn't exist yet
      return {
        sync: '0',
        async: Date.now()
      };
    }
  }, [evvmContract]);

  // Check if user is a staker
  const checkStakerStatus = useCallback(async (userAddress) => {
    if (!stakingContract || !userAddress) return false;

    try {
      return await stakingContract.isStaker(userAddress);
    } catch (err) {
      // User is not a staker if check fails
      return false;
    }
  }, [stakingContract]);

  // Get staked balance
  const getStakedBalance = useCallback(async (userAddress) => {
    if (!stakingContract || !userAddress) return '0';

    try {
      const balance = await stakingContract.stakedBalances(userAddress);
      return ethers.formatEther(balance);
    } catch (err) {
      console.error('Error fetching staked balance:', err);
      return '0';
    }
  }, [stakingContract]);

  // Resolve username to address
  const resolveUsername = useCallback(async (username) => {
    if (!nameServiceContract || !username) return null;

    try {
      const address = await nameServiceContract.verifyStrictAndGetOwnerOfIdentity(username);
      return address;
    } catch (err) {
      console.error('Error resolving username:', err);
      return null;
    }
  }, [nameServiceContract]);

  // Get username by address
  const getUsernameByAddress = useCallback(async (address) => {
    if (!nameServiceContract || !address) return null;

    try {
      const username = await nameServiceContract.getUsernameByAddress(address);
      return username || null;
    } catch (err) {
      // No username registered
      return null;
    }
  }, [nameServiceContract]);

  // Send EVVM payment
  const sendPayment = useCallback(async ({
    to_address = '',
    to_identity = '',
    token = TOKEN_ADDRESSES.mate,
    amount,
    priorityFee = '0',
    priorityFlag = false,
    executor = ethers.ZeroAddress
  }) => {
    if (!evvmContract || !signer || !account) {
      throw new Error('EVVM contract or signer not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get nonce
      const nonces = await getNonces(account);
      const nonce = priorityFlag ? nonces.async : nonces.sync;

      // Build message for signature
      const message = buildPaymentMessage({
        from: account,
        to_address,
        to_identity,
        token,
        amount,
        priorityFee,
        nonce,
        priorityFlag,
        executor
      });

      // Sign message
      const signature = await signer.signMessage(message);

      // Execute payment
      const tx = await evvmContract.pay(
        account,
        to_address,
        to_identity,
        token,
        ethers.parseEther(amount),
        ethers.parseEther(priorityFee),
        nonce,
        priorityFlag,
        executor,
        signature
      );

      const receipt = await tx.wait();
      setIsLoading(false);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (err) {
      console.error('Error sending payment:', err);
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, [evvmContract, signer, account, getNonces]);

  return {
    evvmContract,
    nameServiceContract,
    stakingContract,
    getBalances,
    getNonces,
    checkStakerStatus,
    getStakedBalance,
    resolveUsername,
    getUsernameByAddress,
    sendPayment,
    isLoading,
    error
  };
};

// Helper function to build payment message for signing
function buildPaymentMessage({
  from,
  to_address,
  to_identity,
  token,
  amount,
  priorityFee,
  nonce,
  priorityFlag,
  executor
}) {
  // EVVM payment message format
  const params = [
    from.toLowerCase(),
    to_address.toLowerCase(),
    to_identity,
    token.toLowerCase(),
    ethers.parseEther(amount).toString(),
    ethers.parseEther(priorityFee).toString(),
    nonce.toString(),
    priorityFlag.toString(),
    executor.toLowerCase()
  ].join(',');

  return `pay,${params}`;
}
