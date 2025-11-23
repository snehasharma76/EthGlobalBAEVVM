import { ethers } from 'ethers';
import { BaseAgent } from './BaseAgent.js';
import { MATE_INTEGRATION_ABI } from '../src/config/abis.js';

export class NameServiceAgent extends BaseAgent {
  constructor(config) {
    super({
      ...config,
      name: 'NameServiceAgent'
    });
    this.mateIntegrationAddress = config.mateIntegrationAddress;
    this.nameCache = new Map();
    this.addressCache = new Map();
  }

  async initialize() {
    await super.initialize();
    
    this.contract = await this.getContract(
      this.mateIntegrationAddress,
      MATE_INTEGRATION_ABI
    );
    
    this.log('Initialized', {
      mateIntegrationAddress: this.mateIntegrationAddress
    });

    const filter = this.contract.filters.NameRegistered();
    this.contract.on(filter, (user, name, event) => {
      this.handleNameRegistration(user, name, event);
    });
  }

  async execute() {
    try {
      this.log('Syncing name registrations');
      
      await this.syncRecentRegistrations();
      
      this.log('Name cache status', {
        totalNames: this.nameCache.size,
        totalAddresses: this.addressCache.size
      });
    } catch (error) {
      this.log('Error in execute:', error.message);
      throw error;
    }
  }

  async syncRecentRegistrations() {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 1000);
      
      const filter = this.contract.filters.NameRegistered();
      const events = await this.contract.queryFilter(filter, fromBlock, currentBlock);
      
      for (const event of events) {
        const { user, name } = event.args;
        this.updateCache(user, name);
      }
      
      if (events.length > 0) {
        this.log(`Synced ${events.length} name registrations`);
      }
    } catch (error) {
      this.log('Error syncing registrations:', error.message);
    }
  }

  handleNameRegistration(user, name, event) {
    this.log('New name registered', {
      user,
      name,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash
    });
    
    this.updateCache(user, name);
  }

  updateCache(address, name) {
    this.nameCache.set(name.toLowerCase(), address);
    this.addressCache.set(address.toLowerCase(), name);
  }

  async resolveName(name) {
    const cached = this.nameCache.get(name.toLowerCase());
    if (cached) {
      return cached;
    }

    try {
      const address = await this.contract.resolveName(name);
      if (address !== ethers.ZeroAddress) {
        this.updateCache(address, name);
        return address;
      }
    } catch (error) {
      this.log(`Error resolving name ${name}:`, error.message);
    }
    
    return null;
  }

  async resolveAddress(address) {
    const cached = this.addressCache.get(address.toLowerCase());
    if (cached) {
      return cached;
    }

    try {
      const name = await this.contract.getName(address);
      if (name && name.length > 0) {
        this.updateCache(address, name);
        return name;
      }
    } catch (error) {
      this.log(`Error resolving address ${address}:`, error.message);
    }
    
    return null;
  }

  getCacheStats() {
    return {
      totalNames: this.nameCache.size,
      totalAddresses: this.addressCache.size,
      names: Array.from(this.nameCache.entries()),
      addresses: Array.from(this.addressCache.entries())
    };
  }

  clearCache() {
    this.nameCache.clear();
    this.addressCache.clear();
    this.log('Cache cleared');
  }

  stop() {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
    super.stop();
  }
}
