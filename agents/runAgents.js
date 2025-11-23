import dotenv from 'dotenv';
import { AgentManager } from './AgentManager.js';

dotenv.config();

const config = {
  agentPrivateKey: process.env.AGENT_PRIVATE_KEY,
  rpcUrl: process.env.VITE_RPC_URL || 'https://rpc.sepolia.org',
  
  // Your custom contracts
  streamTippingAddress: process.env.VITE_STREAM_TIPPING_ADDRESS,
  mateIntegrationAddress: process.env.VITE_MATE_INTEGRATION_ADDRESS,
  
  // EVVM contracts
  evvmAddress: process.env.VITE_EVVM_ADDRESS || '0x5c66EB3CAAD38851C9c6291D77510b0Eaa8B3c84',
  nameServiceAddress: process.env.VITE_NAME_SERVICE_ADDRESS || '0x7F41487e77D092BA53c980171C4ebc71d68DC5AE',
  stakingAddress: process.env.VITE_STAKING_ADDRESS || '0x0fb1aD66636411bB50a33458a8De6507D9b270E8',
  
  tipThreshold: process.env.AGENT_TIP_THRESHOLD || '0.1',
  rewardPool: process.env.AGENT_REWARD_POOL || '1.0',
  distributionThreshold: process.env.AGENT_DISTRIBUTION_THRESHOLD || '0.5'
};

async function main() {
  console.log('Starting x402 Agent System...');
  console.log('Configuration:', {
    rpcUrl: config.rpcUrl,
    streamTippingAddress: config.streamTippingAddress,
    mateIntegrationAddress: config.mateIntegrationAddress
  });

  if (!config.agentPrivateKey) {
    console.error('Error: AGENT_PRIVATE_KEY not set in environment');
    process.exit(1);
  }

  if (!config.streamTippingAddress && !config.evvmAddress) {
    console.error('Error: No contract addresses configured');
    console.error('Please configure either StreamTipping or EVVM contracts in .env file');
    process.exit(1);
  }

  const manager = new AgentManager(config);

  try {
    await manager.initialize();
    
    await manager.startAll({
      tipMonitor: 30000,
      rewardDistribution: 300000,
      nameService: 60000
    });

    console.log('\nAgent system running. Press Ctrl+C to stop.\n');

    const statusInterval = setInterval(async () => {
      const status = await manager.getStatus();
      console.log('\n=== Agent Status ===');
      console.log(JSON.stringify(status, null, 2));
      
      const notifications = manager.getTipNotifications();
      if (notifications.length > 0) {
        console.log('\n=== Recent Notifications ===');
        console.log(JSON.stringify(notifications, null, 2));
        manager.clearTipNotifications();
      }
    }, 60000);

    process.on('SIGINT', () => {
      console.log('\nShutting down agents...');
      clearInterval(statusInterval);
      manager.stopAll();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\nShutting down agents...');
      clearInterval(statusInterval);
      manager.stopAll();
      process.exit(0);
    });

  } catch (error) {
    console.error('Fatal error:', error);
    manager.stopAll();
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
