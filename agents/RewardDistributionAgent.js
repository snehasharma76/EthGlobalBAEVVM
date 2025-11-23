import { ethers } from 'ethers';
import { BaseAgent } from './BaseAgent.js';
import { MATE_INTEGRATION_ABI } from '../src/config/abis.js';

export class RewardDistributionAgent extends BaseAgent {
  constructor(config) {
    super({
      ...config,
      name: 'RewardDistributionAgent'
    });
    this.mateIntegrationAddress = config.mateIntegrationAddress;
    this.rewardPool = ethers.parseEther(config.rewardPool || '1.0');
    this.distributionThreshold = ethers.parseEther(config.distributionThreshold || '0.5');
    this.eligibleCreators = new Map();
  }

  async initialize() {
    await super.initialize();
    
    this.contract = await this.getContract(
      this.mateIntegrationAddress,
      MATE_INTEGRATION_ABI
    );
    
    this.log('Initialized', {
      mateIntegrationAddress: this.mateIntegrationAddress,
      rewardPool: ethers.formatEther(this.rewardPool)
    });
  }

  async execute() {
    try {
      this.log('Checking reward distribution eligibility');

      await this.identifyEligibleCreators();
      
      if (this.eligibleCreators.size > 0) {
        await this.distributeRewards();
      } else {
        this.log('No eligible creators for reward distribution');
      }
    } catch (error) {
      this.log('Error in execute:', error.message);
      throw error;
    }
  }

  async identifyEligibleCreators() {
    this.log('Identifying eligible creators based on staking');
    
    const creatorAddresses = Array.from(this.eligibleCreators.keys());
    
    for (const creator of creatorAddresses) {
      try {
        const stake = await this.contract.getUserStake(creator);
        
        if (stake >= this.distributionThreshold) {
          this.eligibleCreators.set(creator, {
            stake: ethers.formatEther(stake),
            eligible: true
          });
          
          this.log(`Creator ${creator} is eligible`, {
            stake: ethers.formatEther(stake)
          });
        } else {
          this.eligibleCreators.delete(creator);
        }
      } catch (error) {
        this.log(`Error checking creator ${creator}:`, error.message);
      }
    }
  }

  async distributeRewards() {
    this.log(`Distributing rewards to ${this.eligibleCreators.size} creators`);
    
    const totalStake = Array.from(this.eligibleCreators.values())
      .reduce((sum, creator) => sum + parseFloat(creator.stake), 0);
    
    for (const [creatorAddress, creatorData] of this.eligibleCreators) {
      try {
        const rewardShare = (parseFloat(creatorData.stake) / totalStake) * 
                           parseFloat(ethers.formatEther(this.rewardPool));
        
        this.log(`Reward calculated for ${creatorAddress}`, {
          stake: creatorData.stake,
          rewardShare: rewardShare.toFixed(6)
        });
        
      } catch (error) {
        this.log(`Error distributing to ${creatorAddress}:`, error.message);
      }
    }
  }

  addCreator(creatorAddress) {
    if (!this.eligibleCreators.has(creatorAddress)) {
      this.eligibleCreators.set(creatorAddress, {
        stake: '0',
        eligible: false
      });
      this.log(`Added creator ${creatorAddress} to monitoring`);
    }
  }

  removeCreator(creatorAddress) {
    if (this.eligibleCreators.has(creatorAddress)) {
      this.eligibleCreators.delete(creatorAddress);
      this.log(`Removed creator ${creatorAddress} from monitoring`);
    }
  }

  getEligibleCreators() {
    return Array.from(this.eligibleCreators.entries()).map(([address, data]) => ({
      address,
      ...data
    }));
  }
}
