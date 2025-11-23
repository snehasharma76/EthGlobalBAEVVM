import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { NETWORK_CONFIG } from '../config/contracts';

export const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask is not installed');
        return false;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });

      if (accounts.length > 0) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        const network = await web3Provider.getNetwork();

        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(accounts[0]);
        setChainId(Number(network.chainId));
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error checking wallet connection:', err);
      setError(err.message);
      return false;
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this dApp.');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));

      return accounts[0];
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setError(null);
  }, []);

  const switchNetwork = useCallback(async (targetChainId = 11155111) => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const networkConfig = NETWORK_CONFIG.sepolia;
      const chainIdHex = networkConfig.chainId;

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }]
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig]
          });
        } else {
          throw switchError;
        }
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const network = await web3Provider.getNetwork();
      setChainId(Number(network.chainId));

      return true;
    } catch (err) {
      console.error('Error switching network:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  const getContract = useCallback((address, abi) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }
    return new ethers.Contract(address, abi, signer);
  }, [signer]);

  const getReadOnlyContract = useCallback((address, abi) => {
    if (!provider) {
      const defaultProvider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
      return new ethers.Contract(address, abi, defaultProvider);
    }
    return new ethers.Contract(address, abi, provider);
  }, [provider]);

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = (chainIdHex) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [checkIfWalletIsConnected, disconnectWallet]);

  return {
    provider,
    signer,
    account,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getContract,
    getReadOnlyContract,
    isConnected: !!account
  };
};
