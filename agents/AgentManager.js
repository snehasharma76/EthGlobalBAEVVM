import { TipMonitorAgent } from './TipMonitorAgent.js';
import { RewardDistributionAgent } from './RewardDistributionAgent.js';
import { NameServiceAgent } from './NameServiceAgent.js';

export class AgentManager {
  constructor(config) {
    this.config = config;
    this.agents = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    console.log('[AgentManager] Initializing agents...');

    try {
      const tipMonitor = new TipMonitorAgent({
        privateKey: this.config.agentPrivateKey,
        rpcUrl: this.config.rpcUrl,
        contractAddress: this.config.streamTippingAddress,
        tipThreshold: this.config.tipThreshold || '0.1'
      });
      await tipMonitor.initialize();
      this.agents.set('tipMonitor', tipMonitor);

      const rewardDistribution = new RewardDistributionAgent({
        privateKey: this.config.agentPrivateKey,
        rpcUrl: this.config.rpcUrl,
        mateIntegrationAddress: this.config.mateIntegrationAddress,
        rewardPool: this.config.rewardPool || '1.0',
        distributionThreshold: this.config.distributionThreshold || '0.5'
      });
      await rewardDistribution.initialize();
      this.agents.set('rewardDistribution', rewardDistribution);

      const nameService = new NameServiceAgent({
        privateKey: this.config.agentPrivateKey,
        rpcUrl: this.config.rpcUrl,
        mateIntegrationAddress: this.config.mateIntegrationAddress
      });
      await nameService.initialize();
      this.agents.set('nameService', nameService);

      this.isInitialized = true;
      console.log('[AgentManager] All agents initialized successfully');
      
      return true;
    } catch (error) {
      console.error('[AgentManager] Error initializing agents:', error);
      throw error;
    }
  }

  async startAll(intervals = {}) {
    if (!this.isInitialized) {
      throw new Error('AgentManager not initialized. Call initialize() first.');
    }

    console.log('[AgentManager] Starting all agents...');

    const tipMonitor = this.agents.get('tipMonitor');
    if (tipMonitor) {
      await tipMonitor.start(intervals.tipMonitor || 30000);
    }

    const rewardDistribution = this.agents.get('rewardDistribution');
    if (rewardDistribution) {
      await rewardDistribution.start(intervals.rewardDistribution || 300000);
    }

    const nameService = this.agents.get('nameService');
    if (nameService) {
      await nameService.start(intervals.nameService || 60000);
    }

    console.log('[AgentManager] All agents started');
  }

  stopAll() {
    console.log('[AgentManager] Stopping all agents...');
    
    for (const [name, agent] of this.agents) {
      try {
        agent.stop();
        console.log(`[AgentManager] Stopped ${name}`);
      } catch (error) {
        console.error(`[AgentManager] Error stopping ${name}:`, error);
      }
    }
    
    console.log('[AgentManager] All agents stopped');
  }

  getAgent(name) {
    return this.agents.get(name);
  }

  getAllAgents() {
    return Array.from(this.agents.entries()).map(([name, agent]) => ({
      name,
      isRunning: agent.isRunning,
      address: agent.wallet?.address
    }));
  }

  async getStatus() {
    const status = {
      initialized: this.isInitialized,
      agents: []
    };

    for (const [name, agent] of this.agents) {
      status.agents.push({
        name,
        isRunning: agent.isRunning,
        address: agent.wallet?.address
      });
    }

    return status;
  }

  async addCreatorToRewardPool(creatorAddress) {
    const rewardAgent = this.agents.get('rewardDistribution');
    if (rewardAgent) {
      rewardAgent.addCreator(creatorAddress);
      console.log(`[AgentManager] Added creator ${creatorAddress} to reward pool`);
    }
  }

  async removeCreatorFromRewardPool(creatorAddress) {
    const rewardAgent = this.agents.get('rewardDistribution');
    if (rewardAgent) {
      rewardAgent.removeCreator(creatorAddress);
      console.log(`[AgentManager] Removed creator ${creatorAddress} from reward pool`);
    }
  }

  async resolveName(name) {
    const nameAgent = this.agents.get('nameService');
    if (nameAgent) {
      return await nameAgent.resolveName(name);
    }
    return null;
  }

  async resolveAddress(address) {
    const nameAgent = this.agents.get('nameService');
    if (nameAgent) {
      return await nameAgent.resolveAddress(address);
    }
    return null;
  }

  getTipNotifications() {
    const tipAgent = this.agents.get('tipMonitor');
    if (tipAgent) {
      return tipAgent.getNotifications();
    }
    return [];
  }

  clearTipNotifications() {
    const tipAgent = this.agents.get('tipMonitor');
    if (tipAgent) {
      tipAgent.clearNotifications();
    }
  }
}
