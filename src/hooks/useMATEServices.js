import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from './useWeb3';
import { getContractAddress } from '../config/contracts';
import { MATE_INTEGRATION_ABI } from '../config/abis';

export const useMATEServices = () => {
  const { getContract, getReadOnlyContract, isConnected } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerName = useCallback(async (name, registrationFee = '0.01') => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = getContractAddress('mateIntegration');
      if (!contractAddress) {
        throw new Error('MATE Integration contract address not configured');
      }

      const contract = getContract(contractAddress, MATE_INTEGRATION_ABI);
      const feeInWei = ethers.parseEther(registrationFee);
      
      const tx = await contract.registerName(name, { value: feeInWei });
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        name
      };
    } catch (err) {
      console.error('Error registering name:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  const resolveName = useCallback(async (name) => {
    try {
      const contractAddress = getContractAddress('mateIntegration');
      if (!contractAddress) {
        throw new Error('MATE Integration contract address not configured');
      }

      const contract = getReadOnlyContract(contractAddress, MATE_INTEGRATION_ABI);
      const address = await contract.resolveName(name);
      
      return address;
    } catch (err) {
      console.error('Error resolving name:', err);
      throw err;
    }
  }, [getReadOnlyContract]);

  const getName = useCallback(async (address) => {
    try {
      const contractAddress = getContractAddress('mateIntegration');
      if (!contractAddress) {
        throw new Error('MATE Integration contract address not configured');
      }

      const contract = getReadOnlyContract(contractAddress, MATE_INTEGRATION_ABI);
      const name = await contract.getName(address);
      
      return name;
    } catch (err) {
      console.error('Error getting name:', err);
      throw err;
    }
  }, [getReadOnlyContract]);

  const stakeTokens = useCallback(async (amount) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = getContractAddress('mateIntegration');
      if (!contractAddress) {
        throw new Error('MATE Integration contract address not configured');
      }

      const contract = getContract(contractAddress, MATE_INTEGRATION_ABI);
      const amountInWei = ethers.parseEther(amount.toString());
      
      const tx = await contract.stakeTokens(amountInWei);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        amount
      };
    } catch (err) {
      console.error('Error staking tokens:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  const unstakeTokens = useCallback(async (amount) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = getContractAddress('mateIntegration');
      if (!contractAddress) {
        throw new Error('MATE Integration contract address not configured');
      }

      const contract = getContract(contractAddress, MATE_INTEGRATION_ABI);
      const amountInWei = ethers.parseEther(amount.toString());
      
      const tx = await contract.unstakeTokens(amountInWei);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        amount
      };
    } catch (err) {
      console.error('Error unstaking tokens:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  const getUserStake = useCallback(async (userAddress) => {
    try {
      const contractAddress = getContractAddress('mateIntegration');
      if (!contractAddress) {
        throw new Error('MATE Integration contract address not configured');
      }

      const contract = getReadOnlyContract(contractAddress, MATE_INTEGRATION_ABI);
      const stake = await contract.getUserStake(userAddress);
      
      return ethers.formatEther(stake);
    } catch (err) {
      console.error('Error getting user stake:', err);
      throw err;
    }
  }, [getReadOnlyContract]);

  const claimRewards = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = getContractAddress('mateIntegration');
      if (!contractAddress) {
        throw new Error('MATE Integration contract address not configured');
      }

      const contract = getContract(contractAddress, MATE_INTEGRATION_ABI);
      const tx = await contract.claimStakingRewards();
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (err) {
      console.error('Error claiming rewards:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  const createSwap = useCallback(async (
    tokenOffered,
    amountOffered,
    tokenRequested,
    amountRequested
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = getContractAddress('mateIntegration');
      if (!contractAddress) {
        throw new Error('MATE Integration contract address not configured');
      }

      const contract = getContract(contractAddress, MATE_INTEGRATION_ABI);
      
      const amountOfferedWei = ethers.parseEther(amountOffered.toString());
      const amountRequestedWei = ethers.parseEther(amountRequested.toString());
      
      const tx = await contract.createSwap(
        tokenOffered,
        amountOfferedWei,
        tokenRequested,
        amountRequestedWei
      );
      
      const receipt = await tx.wait();
      
      const swapCreatedEvent = receipt.logs.find(
        log => log.fragment && log.fragment.name === 'SwapOfferCreated'
      );
      
      const offerId = swapCreatedEvent ? swapCreatedEvent.args.offerId : null;
      
      return {
        success: true,
        transactionHash: receipt.hash,
        offerId: offerId ? Number(offerId) : null
      };
    } catch (err) {
      console.error('Error creating swap:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  const acceptSwap = useCallback(async (offerId) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = getContractAddress('mateIntegration');
      if (!contractAddress) {
        throw new Error('MATE Integration contract address not configured');
      }

      const contract = getContract(contractAddress, MATE_INTEGRATION_ABI);
      const tx = await contract.acceptSwap(offerId);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (err) {
      console.error('Error accepting swap:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  const cancelSwap = useCallback(async (offerId) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const contractAddress = getContractAddress('mateIntegration');
      if (!contractAddress) {
        throw new Error('MATE Integration contract address not configured');
      }

      const contract = getContract(contractAddress, MATE_INTEGRATION_ABI);
      const tx = await contract.cancelSwap(offerId);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (err) {
      console.error('Error cancelling swap:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  return {
    registerName,
    resolveName,
    getName,
    stakeTokens,
    unstakeTokens,
    getUserStake,
    claimRewards,
    createSwap,
    acceptSwap,
    cancelSwap,
    isLoading,
    error
  };
};
