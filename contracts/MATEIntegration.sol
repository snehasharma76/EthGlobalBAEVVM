// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IMATENameService
 * @notice Interface for MATE Name Service
 */
interface IMATENameService {
    function register(string calldata name) external payable;
    function resolve(string calldata name) external view returns (address);
    function reverseResolve(address addr) external view returns (string memory);
    function updateAddress(string calldata name, address newAddress) external;
}

/**
 * @title IMATEStaking
 * @notice Interface for MATE Staking
 */
interface IMATEStaking {
    function stake(uint256 amount) external;
    function unstake(uint256 amount) external;
    function getStake(address user) external view returns (uint256);
    function claimRewards() external;
    function getRewards(address user) external view returns (uint256);
}

/**
 * @title IMATEP2PSwap
 * @notice Interface for MATE P2P Swap
 */
interface IMATEP2PSwap {
    function createSwapOffer(
        address tokenOffered,
        uint256 amountOffered,
        address tokenRequested,
        uint256 amountRequested
    ) external returns (uint256 offerId);
    
    function acceptSwapOffer(uint256 offerId) external;
    function cancelSwapOffer(uint256 offerId) external;
    function getSwapOffer(uint256 offerId) external view returns (
        address creator,
        address tokenOffered,
        uint256 amountOffered,
        address tokenRequested,
        uint256 amountRequested,
        bool isActive
    );
}

/**
 * @title MATEIntegration
 * @notice Integration layer for MATE Metaprotocol services
 * @dev Provides unified interface for NameService, Staking, and P2P Swap
 */
contract MATEIntegration {
    IMATENameService public nameService;
    IMATEStaking public staking;
    IMATEP2PSwap public p2pSwap;
    
    mapping(address => string) public userNames;
    mapping(address => bool) public hasRegisteredName;
    
    event NameRegistered(address indexed user, string name);
    event StakeDeposited(address indexed user, uint256 amount);
    event StakeWithdrawn(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event SwapOfferCreated(address indexed creator, uint256 offerId);
    event SwapOfferAccepted(uint256 indexed offerId, address indexed acceptor);
    
    error ServiceNotConfigured(string service);
    error NameAlreadyRegistered(address user);
    
    constructor(
        address _nameService,
        address _staking,
        address _p2pSwap
    ) {
        if (_nameService != address(0)) {
            nameService = IMATENameService(_nameService);
        }
        if (_staking != address(0)) {
            staking = IMATEStaking(_staking);
        }
        if (_p2pSwap != address(0)) {
            p2pSwap = IMATEP2PSwap(_p2pSwap);
        }
    }
    
    /**
     * @notice Register a name in MATE Name Service
     * @param name Desired name
     */
    function registerName(string calldata name) external payable {
        if (address(nameService) == address(0)) {
            revert ServiceNotConfigured("NameService");
        }
        
        if (hasRegisteredName[msg.sender]) {
            revert NameAlreadyRegistered(msg.sender);
        }
        
        nameService.register{value: msg.value}(name);
        userNames[msg.sender] = name;
        hasRegisteredName[msg.sender] = true;
        
        emit NameRegistered(msg.sender, name);
    }
    
    /**
     * @notice Resolve a name to an address
     * @param name Name to resolve
     * @return address Address associated with the name
     */
    function resolveName(string calldata name) external view returns (address) {
        if (address(nameService) == address(0)) {
            revert ServiceNotConfigured("NameService");
        }
        
        return nameService.resolve(name);
    }
    
    /**
     * @notice Get name for an address
     * @param addr Address to lookup
     * @return string Name associated with the address
     */
    function getName(address addr) external view returns (string memory) {
        if (address(nameService) == address(0)) {
            revert ServiceNotConfigured("NameService");
        }
        
        return nameService.reverseResolve(addr);
    }
    
    /**
     * @notice Stake tokens in MATE Staking
     * @param amount Amount to stake
     */
    function stakeTokens(uint256 amount) external {
        if (address(staking) == address(0)) {
            revert ServiceNotConfigured("Staking");
        }
        
        staking.stake(amount);
        emit StakeDeposited(msg.sender, amount);
    }
    
    /**
     * @notice Unstake tokens from MATE Staking
     * @param amount Amount to unstake
     */
    function unstakeTokens(uint256 amount) external {
        if (address(staking) == address(0)) {
            revert ServiceNotConfigured("Staking");
        }
        
        staking.unstake(amount);
        emit StakeWithdrawn(msg.sender, amount);
    }
    
    /**
     * @notice Get user's stake amount
     * @param user Address of the user
     * @return uint256 Staked amount
     */
    function getUserStake(address user) external view returns (uint256) {
        if (address(staking) == address(0)) {
            revert ServiceNotConfigured("Staking");
        }
        
        return staking.getStake(user);
    }
    
    /**
     * @notice Claim staking rewards
     */
    function claimStakingRewards() external {
        if (address(staking) == address(0)) {
            revert ServiceNotConfigured("Staking");
        }
        
        uint256 rewards = staking.getRewards(msg.sender);
        staking.claimRewards();
        
        emit RewardsClaimed(msg.sender, rewards);
    }
    
    /**
     * @notice Create a P2P swap offer
     * @param tokenOffered Token being offered
     * @param amountOffered Amount being offered
     * @param tokenRequested Token being requested
     * @param amountRequested Amount being requested
     * @return offerId ID of the created offer
     */
    function createSwap(
        address tokenOffered,
        uint256 amountOffered,
        address tokenRequested,
        uint256 amountRequested
    ) external returns (uint256 offerId) {
        if (address(p2pSwap) == address(0)) {
            revert ServiceNotConfigured("P2PSwap");
        }
        
        offerId = p2pSwap.createSwapOffer(
            tokenOffered,
            amountOffered,
            tokenRequested,
            amountRequested
        );
        
        emit SwapOfferCreated(msg.sender, offerId);
        return offerId;
    }
    
    /**
     * @notice Accept a P2P swap offer
     * @param offerId ID of the offer to accept
     */
    function acceptSwap(uint256 offerId) external {
        if (address(p2pSwap) == address(0)) {
            revert ServiceNotConfigured("P2PSwap");
        }
        
        p2pSwap.acceptSwapOffer(offerId);
        emit SwapOfferAccepted(offerId, msg.sender);
    }
    
    /**
     * @notice Cancel a P2P swap offer
     * @param offerId ID of the offer to cancel
     */
    function cancelSwap(uint256 offerId) external {
        if (address(p2pSwap) == address(0)) {
            revert ServiceNotConfigured("P2PSwap");
        }
        
        p2pSwap.cancelSwapOffer(offerId);
    }
}
