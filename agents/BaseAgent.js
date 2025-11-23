import { ethers } from 'ethers';

export class BaseAgent {
  constructor(config) {
    this.name = config.name;
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
    this.isRunning = false;
    this.intervalId = null;
    this.config = config;
  }

  async initialize() {
    const balance = await this.provider.getBalance(this.wallet.address);
    console.log(`[${this.name}] Initialized`);
    console.log(`[${this.name}] Address: ${this.wallet.address}`);
    console.log(`[${this.name}] Balance: ${ethers.formatEther(balance)} ETH`);
  }

  async execute() {
    throw new Error('execute() must be implemented by subclass');
  }

  async start(intervalMs = 60000) {
    if (this.isRunning) {
      console.log(`[${this.name}] Already running`);
      return;
    }

    this.isRunning = true;
    console.log(`[${this.name}] Starting with interval ${intervalMs}ms`);

    await this.execute();

    this.intervalId = setInterval(async () => {
      try {
        await this.execute();
      } catch (error) {
        console.error(`[${this.name}] Error during execution:`, error);
      }
    }, intervalMs);
  }

  stop() {
    if (!this.isRunning) {
      console.log(`[${this.name}] Not running`);
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log(`[${this.name}] Stopped`);
  }

  async getContract(address, abi) {
    return new ethers.Contract(address, abi, this.wallet);
  }

  async sendTransaction(tx) {
    try {
      const transaction = await this.wallet.sendTransaction(tx);
      console.log(`[${this.name}] Transaction sent: ${transaction.hash}`);
      const receipt = await transaction.wait();
      console.log(`[${this.name}] Transaction confirmed in block ${receipt.blockNumber}`);
      return receipt;
    } catch (error) {
      console.error(`[${this.name}] Transaction failed:`, error);
      throw error;
    }
  }

  log(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${this.name}] ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }
}
