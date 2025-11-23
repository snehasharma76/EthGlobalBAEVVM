// EVVM Core Contract ABIs

export const EVVM_ABI = [
  // Payment functions
  "function pay(address from, address to_address, string to_identity, address token, uint256 amount, uint256 priorityFee, uint256 nonce, bool priorityFlag, address executor, bytes signature) external",
  "function payMultiple(address from, address[] to_addresses, string[] to_identities, address token, uint256[] amounts, uint256 priorityFee, uint256 nonce, bool priorityFlag, address executor, bytes signature) external",
  
  // Balance queries
  "function principalBalances(address user, address token) external view returns (uint256)",
  "function rewardBalances(address user) external view returns (uint256)",
  
  // Nonce queries
  "function nextSyncUsedNonce(address user) external view returns (uint256)",
  "function asyncUsedNonce(address user, uint256 nonce) external view returns (bool)",
  
  // Events
  "event Payment(address indexed from, address indexed to, address token, uint256 amount, uint256 priorityFee, bool isStaker)",
  "event RewardGranted(address indexed recipient, uint256 amount)"
];

export const NAME_SERVICE_ABI = [
  // Registration functions
  "function registrationUsername(address user, string username, uint256 clowNumber, uint256 nameServiceNonce, bytes signature) external",
  
  // Query functions
  "function verifyStrictAndGetOwnerOfIdentity(string identity) external view returns (address)",
  "function getUsernameByAddress(address user) external view returns (string)",
  "function getAddressByUsername(string username) external view returns (address)",
  
  // Nonce query
  "function nameServiceNonce(address user) external view returns (uint256)",
  
  // Events
  "event UsernameRegistered(address indexed user, string username, uint256 clowNumber)",
  "event UsernameUpdated(address indexed user, string oldUsername, string newUsername)"
];

export const STAKING_ABI = [
  // Staking functions
  "function publicStaking(address user, uint256 amount, uint256 stakingNonce, string additionalData, bytes signature) external",
  "function publicUnstaking(address user, uint256 amount, uint256 stakingNonce, string additionalData, bytes signature) external",
  
  // Query functions
  "function stakedBalances(address user) external view returns (uint256)",
  "function isStaker(address user) external view returns (bool)",
  "function stakingNonce(address user) external view returns (uint256)",
  
  // Events
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount)",
  "event RewardClaimed(address indexed user, uint256 amount)"
];

export const ESTIMATOR_ABI = [
  // Estimation functions
  "function estimateRewards(address user) external view returns (uint256)",
  "function getCurrentEpoch() external view returns (uint256)",
  
  // Events
  "event EpochAdvanced(uint256 indexed epoch, uint256 timestamp)",
  "event RewardsDistributed(uint256 indexed epoch, uint256 totalRewards)"
];
