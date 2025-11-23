export const NETWORK_CONFIG = {
  sepolia: {
    chainId: '0xaa36a7',
    chainIdDecimal: 11155111,
    chainName: 'Sepolia Testnet',
    nativeCurrency: {
      name: 'Sepolia ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  }
};

export const CONTRACT_ADDRESSES = {
  sepolia: {
    // Your custom contracts
    asyncNonceManager: import.meta.env.VITE_ASYNC_NONCE_MANAGER_ADDRESS || '',
    executor: import.meta.env.VITE_EXECUTOR_ADDRESS || '',
    streamTipping: import.meta.env.VITE_STREAM_TIPPING_ADDRESS || '0x49C31b473C3EfBe8F5384eB7b77C257A961C8Fc8',
    mateIntegration: import.meta.env.VITE_MATE_INTEGRATION_ADDRESS || '',
    
    // EVVM Core Contracts (Official Sepolia Deployment)
    evvm: import.meta.env.VITE_EVVM_ADDRESS || '0x5c66EB3CAAD38851C9c6291D77510b0Eaa8B3c84',
    nameService: import.meta.env.VITE_NAME_SERVICE_ADDRESS || '0x7F41487e77D092BA53c980171C4ebc71d68DC5AE',
    staking: import.meta.env.VITE_STAKING_ADDRESS || '0x0fb1aD66636411bB50a33458a8De6507D9b270E8',
    estimator: import.meta.env.VITE_ESTIMATOR_ADDRESS || '0xF66464ccf2d0e56DFA15572c122C6474B0A1c82C',
    
    // Legacy MATE addresses (for backward compatibility)
    mateNameService: import.meta.env.VITE_MATE_NAME_SERVICE_ADDRESS || '0x7F41487e77D092BA53c980171C4ebc71d68DC5AE',
    mateStaking: import.meta.env.VITE_MATE_STAKING_ADDRESS || '0x0fb1aD66636411bB50a33458a8De6507D9b270E8',
    mateP2PSwap: import.meta.env.VITE_MATE_P2P_SWAP_ADDRESS || ''
  }
};

// EVVM Token Addresses (as per EVVM protocol)
export const TOKEN_ADDRESSES = {
  mate: '0x0000000000000000000000000000000000000001', // MATE principal token
  eth: '0x0000000000000000000000000000000000000000'   // ETH (zero address)
};

export const PLATFORM_CONFIG = {
  platformWallet: import.meta.env.VITE_PLATFORM_WALLET || '',
  minimumTipAmount: '0.001',
  platformFeePercent: 2.5
};

export const getContractAddress = (contractName, chainId = 11155111) => {
  const network = chainId === 11155111 ? 'sepolia' : 'sepolia';
  return CONTRACT_ADDRESSES[network][contractName];
};

export const getNetworkConfig = (chainId = 11155111) => {
  return chainId === 11155111 ? NETWORK_CONFIG.sepolia : NETWORK_CONFIG.sepolia;
};
