// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AsyncNonceManager.sol";

/**
 * @title StreamTipping
 * @notice Tipping contract for live stream creators with async nonce support
 * @dev Supports direct tips, subscriptions, and revenue sharing
 */
contract StreamTipping is AsyncNonceManager {
    struct Creator {
        address payable wallet;
        uint256 totalTips;
        uint256 tipCount;
        bool isActive;
    }
    
    struct Tip {
        address tipper;
        address creator;
        uint256 amount;
        uint256 timestamp;
        string message;
    }
    
    mapping(address => Creator) public creators;
    mapping(address => Tip[]) public creatorTips;
    mapping(address => uint256) public userTotalTipped;
    
    uint256 public platformFee = 250; // 2.5% in basis points
    uint256 public constant FEE_DENOMINATOR = 10000;
    address payable public platformWallet;
    
    uint256 public totalTipsProcessed;
    uint256 public totalVolume;
    
    event CreatorRegistered(address indexed creator);
    event TipSent(
        address indexed tipper,
        address indexed creator,
        uint256 amount,
        uint256 platformFee,
        string message,
        uint256 nonce
    );
    event CreatorWithdrawal(address indexed creator, uint256 amount);
    event PlatformFeeUpdated(uint256 newFee);
    
    error CreatorNotActive(address creator);
    error InsufficientTipAmount(uint256 minimum);
    error WithdrawalFailed();
    error InvalidFee(uint256 fee);
    error Unauthorized();
    
    constructor(address payable _platformWallet) {
        platformWallet = _platformWallet;
    }
    
    /**
     * @notice Register as a creator
     */
    function registerCreator() external {
        creators[msg.sender] = Creator({
            wallet: payable(msg.sender),
            totalTips: 0,
            tipCount: 0,
            isActive: true
        });
        
        emit CreatorRegistered(msg.sender);
    }
    
    /**
     * @notice Send a tip to a creator with async nonce
     * @param creator Address of the creator
     * @param message Optional message with the tip
     * @param nonce Async nonce for this transaction
     */
    function sendTip(
        address creator,
        string calldata message,
        uint256 nonce
    ) external payable {
        _useNonce(nonce);
        
        if (!creators[creator].isActive) {
            revert CreatorNotActive(creator);
        }
        
        if (msg.value < 0.001 ether) {
            revert InsufficientTipAmount(0.001 ether);
        }
        
        uint256 feeAmount = (msg.value * platformFee) / FEE_DENOMINATOR;
        uint256 creatorAmount = msg.value - feeAmount;
        
        creators[creator].totalTips += creatorAmount;
        creators[creator].tipCount += 1;
        userTotalTipped[msg.sender] += msg.value;
        
        creatorTips[creator].push(Tip({
            tipper: msg.sender,
            creator: creator,
            amount: msg.value,
            timestamp: block.timestamp,
            message: message
        }));
        
        totalTipsProcessed += 1;
        totalVolume += msg.value;
        
        (bool creatorSuccess, ) = creators[creator].wallet.call{value: creatorAmount}("");
        require(creatorSuccess, "Creator transfer failed");
        
        if (feeAmount > 0) {
            (bool feeSuccess, ) = platformWallet.call{value: feeAmount}("");
            require(feeSuccess, "Fee transfer failed");
        }
        
        emit TipSent(msg.sender, creator, msg.value, feeAmount, message, nonce);
    }
    
    /**
     * @notice Get tips for a creator
     * @param creator Address of the creator
     * @return Tip[] Array of tips
     */
    function getCreatorTips(address creator) external view returns (Tip[] memory) {
        return creatorTips[creator];
    }
    
    /**
     * @notice Get creator statistics
     * @param creator Address of the creator
     * @return totalTips Total tips received
     * @return tipCount Number of tips received
     * @return isActive Whether creator is active
     */
    function getCreatorStats(address creator) external view returns (
        uint256 totalTips,
        uint256 tipCount,
        bool isActive
    ) {
        Creator memory c = creators[creator];
        return (c.totalTips, c.tipCount, c.isActive);
    }
    
    /**
     * @notice Update platform fee (only platform wallet)
     * @param newFee New fee in basis points
     */
    function updatePlatformFee(uint256 newFee) external {
        if (msg.sender != platformWallet) {
            revert Unauthorized();
        }
        
        if (newFee > 1000) {
            revert InvalidFee(newFee);
        }
        
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }
    
    /**
     * @notice Deactivate creator account
     */
    function deactivateCreator() external {
        creators[msg.sender].isActive = false;
    }
    
    /**
     * @notice Reactivate creator account
     */
    function reactivateCreator() external {
        creators[msg.sender].isActive = true;
    }
    
    receive() external payable {}
}
