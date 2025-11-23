import { ethers } from 'ethers';
import { BaseAgent } from './BaseAgent.js';
import { STREAM_TIPPING_ABI } from '../src/config/abis.js';

export class TipMonitorAgent extends BaseAgent {
  constructor(config) {
    super({
      ...config,
      name: 'TipMonitorAgent'
    });
    this.contractAddress = config.contractAddress;
    this.lastProcessedBlock = 0;
    this.tipThreshold = ethers.parseEther(config.tipThreshold || '0.1');
    this.notifications = [];
  }

  async initialize() {
    await super.initialize();
    
    this.contract = await this.getContract(
      this.contractAddress,
      STREAM_TIPPING_ABI
    );

    const currentBlock = await this.provider.getBlockNumber();
    this.lastProcessedBlock = currentBlock;
    
    this.log('Initialized', {
      contractAddress: this.contractAddress,
      startingBlock: this.lastProcessedBlock
    });
  }

  async execute() {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      
      if (currentBlock <= this.lastProcessedBlock) {
        return;
      }

      this.log(`Scanning blocks ${this.lastProcessedBlock + 1} to ${currentBlock}`);

      const filter = this.contract.filters.TipSent();
      const events = await this.contract.queryFilter(
        filter,
        this.lastProcessedBlock + 1,
        currentBlock
      );

      for (const event of events) {
        await this.processTipEvent(event);
      }

      this.lastProcessedBlock = currentBlock;
      
      if (events.length > 0) {
        this.log(`Processed ${events.length} tip events`);
      }
    } catch (error) {
      this.log('Error in execute:', error.message);
      throw error;
    }
  }

  async processTipEvent(event) {
    const { tipper, creator, amount, platformFee, message, nonce } = event.args;
    
    const tipData = {
      tipper,
      creator,
      amount: ethers.formatEther(amount),
      platformFee: ethers.formatEther(platformFee),
      message,
      nonce: Number(nonce),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    };

    this.log('New tip detected', tipData);

    if (amount >= this.tipThreshold) {
      this.log('Large tip detected!', {
        amount: tipData.amount,
        threshold: ethers.formatEther(this.tipThreshold)
      });
      
      this.notifications.push({
        type: 'LARGE_TIP',
        data: tipData,
        timestamp: Date.now()
      });
    }

    await this.analyzeCreatorPerformance(creator);
  }

  async analyzeCreatorPerformance(creatorAddress) {
    try {
      const [totalTips, tipCount, isActive] = await this.contract.getCreatorStats(creatorAddress);
      
      const stats = {
        creator: creatorAddress,
        totalTips: ethers.formatEther(totalTips),
        tipCount: Number(tipCount),
        isActive,
        averageTip: Number(tipCount) > 0 
          ? parseFloat(ethers.formatEther(totalTips)) / Number(tipCount)
          : 0
      };

      this.log('Creator performance', stats);

      return stats;
    } catch (error) {
      this.log('Error analyzing creator performance:', error.message);
    }
  }

  getNotifications() {
    return this.notifications;
  }

  clearNotifications() {
    this.notifications = [];
  }
}
