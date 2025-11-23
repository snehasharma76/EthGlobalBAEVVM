import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';
import { getContractAddress } from '../config/contracts';
import { STREAM_TIPPING_ABI, ASYNC_NONCE_MANAGER_ABI } from '../config/abis';

export const useStreamTipping = () => {
  const { getContract, getReadOnlyContract, account, isConnected } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getNextNonce = useCallback(async () => {
    try {
      const contractAddress = getContractAddress('streamTipping');
      if (!contractAddress) {
        throw new Error('StreamTipping contract address not configured');
      }

      const contract = getReadOnlyContract(contractAddress, ASYNC_NONCE_MANAGER_ABI);
      const nonce = await contract.getNextNonce(account);
      return Number(nonce);
    } catch (err) {
      console.error('Error getting next nonce:', err);
      throw err;
    }
  }, [account, getReadOnlyContract]);

  const registerAsCreator = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = getContractAddress('streamTipping');
      if (!contractAddress) {
        throw new Error('StreamTipping contract address not configured');
      }

      const contract = getContract(contractAddress, STREAM_TIPPING_ABI);
      const tx = await contract.registerCreator();
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (err) {
      console.error('Error registering creator:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  const sendTip = useCallback(async (creatorAddress, amount, message = '') => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = getContractAddress('streamTipping');
      if (!contractAddress) {
        throw new Error('StreamTipping contract address not configured');
      }

      const nonce = await getNextNonce();
      const contract = getContract(contractAddress, STREAM_TIPPING_ABI);
      
      const amountInWei = ethers.parseEther(amount.toString());
      
      const tx = await contract.sendTip(
        creatorAddress,
        message,
        nonce,
        { value: amountInWei }
      );
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        nonce
      };
    } catch (err) {
      console.error('Error sending tip:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract, getNextNonce]);

  const getCreatorStats = useCallback(async (creatorAddress) => {
    try {
      const contractAddress = getContractAddress('streamTipping');
      if (!contractAddress) {
        throw new Error('StreamTipping contract address not configured');
      }

      const contract = getReadOnlyContract(contractAddress, STREAM_TIPPING_ABI);
      const [totalTips, tipCount, isActive] = await contract.getCreatorStats(creatorAddress);
      
      return {
        totalTips: ethers.formatEther(totalTips),
        tipCount: Number(tipCount),
        isActive
      };
    } catch (err) {
      console.error('Error getting creator stats:', err);
      throw err;
    }
  }, [getReadOnlyContract]);

  const getCreatorTips = useCallback(async (creatorAddress) => {
    try {
      const contractAddress = getContractAddress('streamTipping');
      if (!contractAddress) {
        throw new Error('StreamTipping contract address not configured');
      }

      const contract = getReadOnlyContract(contractAddress, STREAM_TIPPING_ABI);
      const tips = await contract.getCreatorTips(creatorAddress);
      
      return tips.map(tip => ({
        tipper: tip.tipper,
        creator: tip.creator,
        amount: ethers.formatEther(tip.amount),
        timestamp: Number(tip.timestamp),
        message: tip.message
      }));
    } catch (err) {
      console.error('Error getting creator tips:', err);
      throw err;
    }
  }, [getReadOnlyContract]);

  const getUserTotalTipped = useCallback(async (userAddress) => {
    try {
      const contractAddress = getContractAddress('streamTipping');
      if (!contractAddress) {
        throw new Error('StreamTipping contract address not configured');
      }

      const contract = getReadOnlyContract(contractAddress, STREAM_TIPPING_ABI);
      const total = await contract.userTotalTipped(userAddress);
      
      return ethers.formatEther(total);
    } catch (err) {
      console.error('Error getting user total tipped:', err);
      throw err;
    }
  }, [getReadOnlyContract]);

  const getPlatformStats = useCallback(async () => {
    try {
      const contractAddress = getContractAddress('streamTipping');
      if (!contractAddress) {
        throw new Error('StreamTipping contract address not configured');
      }

      const contract = getReadOnlyContract(contractAddress, STREAM_TIPPING_ABI);
      
      const [totalTipsProcessed, totalVolume, platformFee] = await Promise.all([
        contract.totalTipsProcessed(),
        contract.totalVolume(),
        contract.platformFee()
      ]);
      
      return {
        totalTipsProcessed: Number(totalTipsProcessed),
        totalVolume: ethers.formatEther(totalVolume),
        platformFeePercent: Number(platformFee) / 100
      };
    } catch (err) {
      console.error('Error getting platform stats:', err);
      throw err;
    }
  }, [getReadOnlyContract]);

  return {
    registerAsCreator,
    sendTip,
    getCreatorStats,
    getCreatorTips,
    getUserTotalTipped,
    getPlatformStats,
    getNextNonce,
    isLoading,
    error
  };
};
