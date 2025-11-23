export const STREAM_TIPPING_ABI = [
  "function registerCreator() external",
  "function sendTip(address creator, string calldata message, uint256 nonce) external payable",
  "function getCreatorTips(address creator) external view returns (tuple(address tipper, address creator, uint256 amount, uint256 timestamp, string message)[])",
  "function getCreatorStats(address creator) external view returns (uint256 totalTips, uint256 tipCount, bool isActive)",
  "function creators(address) external view returns (address wallet, uint256 totalTips, uint256 tipCount, bool isActive)",
  "function userTotalTipped(address) external view returns (uint256)",
  "function totalTipsProcessed() external view returns (uint256)",
  "function totalVolume() external view returns (uint256)",
  "function platformFee() external view returns (uint256)",
  "function deactivateCreator() external",
  "function reactivateCreator() external",
  "event TipSent(address indexed tipper, address indexed creator, uint256 amount, uint256 platformFee, string message, uint256 nonce)",
  "event CreatorRegistered(address indexed creator)"
];

export const ASYNC_NONCE_MANAGER_ABI = [
  "function isNonceUsed(address user, uint256 nonce) external view returns (bool)",
  "function getNextNonce(address user) external view returns (uint256)",
  "event NonceUsed(address indexed user, uint256 nonce)"
];

export const EXECUTOR_ABI = [
  "function executeBatch(tuple(address target, uint256 value, bytes data)[] calldata calls, uint256 nonce) external payable returns (tuple(bool success, bytes returnData)[])",
  "function executeCall(address target, uint256 value, bytes calldata data, uint256 nonce) external payable returns (bool success, bytes returnData)",
  "function isNonceUsed(address user, uint256 nonce) external view returns (bool)",
  "function getNextNonce(address user) external view returns (uint256)",
  "event BatchExecuted(address indexed executor, uint256 nonce, uint256 callCount)",
  "event CallExecuted(address indexed target, uint256 value, bool success)"
];

export const MATE_INTEGRATION_ABI = [
  "function registerName(string calldata name) external payable",
  "function resolveName(string calldata name) external view returns (address)",
  "function getName(address addr) external view returns (string memory)",
  "function stakeTokens(uint256 amount) external",
  "function unstakeTokens(uint256 amount) external",
  "function getUserStake(address user) external view returns (uint256)",
  "function claimStakingRewards() external",
  "function createSwap(address tokenOffered, uint256 amountOffered, address tokenRequested, uint256 amountRequested) external returns (uint256 offerId)",
  "function acceptSwap(uint256 offerId) external",
  "function cancelSwap(uint256 offerId) external",
  "event NameRegistered(address indexed user, string name)",
  "event StakeDeposited(address indexed user, uint256 amount)",
  "event StakeWithdrawn(address indexed user, uint256 amount)",
  "event RewardsClaimed(address indexed user, uint256 amount)",
  "event SwapOfferCreated(address indexed creator, uint256 offerId)",
  "event SwapOfferAccepted(uint256 indexed offerId, address indexed acceptor)"
];

export const MATE_NAME_SERVICE_ABI = [
  "function register(string calldata name) external payable",
  "function resolve(string calldata name) external view returns (address)",
  "function reverseResolve(address addr) external view returns (string memory)",
  "function updateAddress(string calldata name, address newAddress) external"
];

export const MATE_STAKING_ABI = [
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "function getStake(address user) external view returns (uint256)",
  "function claimRewards() external",
  "function getRewards(address user) external view returns (uint256)"
];

export const MATE_P2P_SWAP_ABI = [
  "function createSwapOffer(address tokenOffered, uint256 amountOffered, address tokenRequested, uint256 amountRequested) external returns (uint256 offerId)",
  "function acceptSwapOffer(uint256 offerId) external",
  "function cancelSwapOffer(uint256 offerId) external",
  "function getSwapOffer(uint256 offerId) external view returns (address creator, address tokenOffered, uint256 amountOffered, address tokenRequested, uint256 amountRequested, bool isActive)"
];
