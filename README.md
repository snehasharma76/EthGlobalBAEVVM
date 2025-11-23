# Chiliz-Maxxing: EVVM Live Streaming Platform

A decentralized live streaming platform built on EVVM with MATE Metaprotocol integration and x402 autonomous agents.

## Features

### Core Functionality
- **Live Streaming**: Real-time video streaming powered by ZegoCloud
- **Blockchain Tipping**: Send tips to creators using ETH on Sepolia testnet
- **Async Nonces**: Parallel transaction execution for improved UX
- **Executor Pattern**: Batched operations for gas optimization

### MATE Metaprotocol Integration
- **Name Service**: Register and resolve human-readable names
- **Staking**: Stake tokens for rewards and governance
- **P2P Swap**: Decentralized token exchange

### x402 Autonomous Agents
- **TipMonitorAgent**: Real-time monitoring of tip events and creator analytics
- **RewardDistributionAgent**: Automated reward distribution based on staking
- **NameServiceAgent**: Name resolution caching and synchronization

## Technology Stack

### Frontend
- React 19.1.0
- Vite 6.3.5
- TailwindCSS 4.1.6
- ethers.js 6.9.0
- React Router DOM 7.9.6
- ZegoCloud UIKit

### Smart Contracts
- Solidity 0.8.20
- AsyncNonceManager (bitmap-based nonce tracking)
- Executor (batched transaction execution)
- StreamTipping (creator tipping with platform fees)
- MATEIntegration (unified MATE service interface)

### Agents
- Node.js ES modules
- Event-driven architecture
- Autonomous operation with configurable intervals

## Quick Start

### Prerequisites
- Node.js v18+
- MetaMask wallet
- Sepolia ETH (from faucet)

### Installation

1. Clone and install dependencies:
```bash
cd LiveStreamingApp
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development server:
```bash
npm run dev
```

4. Deploy smart contracts (see DEPLOYMENT_GUIDE.md)

5. Run x402 agents:
```bash
node agents/runAgents.js
```

## Project Structure

```
LiveStreamingApp/
├── contracts/              # Solidity smart contracts
│   ├── AsyncNonceManager.sol
│   ├── Executor.sol
│   ├── StreamTipping.sol
│   └── MATEIntegration.sol
├── agents/                 # x402 autonomous agents
│   ├── BaseAgent.js
│   ├── TipMonitorAgent.js
│   ├── RewardDistributionAgent.js
│   ├── NameServiceAgent.js
│   ├── AgentManager.js
│   └── runAgents.js
├── src/
│   ├── components/        # React components
│   │   ├── JoinForm.jsx
│   │   ├── LiveStream.jsx
│   │   ├── TipContract.jsx
│   │   └── WalletConnect.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useWeb3.js
│   │   ├── useStreamTipping.js
│   │   └── useMATEServices.js
│   ├── config/           # Configuration files
│   │   ├── contracts.js
│   │   └── abis.js
│   └── App.jsx
├── DEPLOYMENT_GUIDE.md   # Comprehensive deployment guide
└── package.json

```

## Smart Contract Architecture

### AsyncNonceManager
- Bitmap-based nonce tracking (256 nonces per bitmap)
- Enables parallel transaction execution
- No sequential nonce requirements

### Executor
- Batched transaction execution
- Async nonce integration
- Gas optimization through batching
- Automatic refund of excess ETH

### StreamTipping
- Creator registration and management
- Tip sending with async nonces
- Platform fee (2.5% default)
- Creator statistics and analytics
- Tip history tracking

### MATEIntegration
- Unified interface for MATE services
- Name registration and resolution
- Staking and reward claiming
- P2P swap creation and acceptance
- Graceful degradation if services unavailable

## Agent System

### Architecture
- Base agent class with common functionality
- Event-driven monitoring
- Configurable execution intervals
- Automatic error handling and recovery

### TipMonitorAgent
- Monitors TipSent events
- Tracks creator performance
- Generates notifications for large tips
- Calculates average tips per creator

### RewardDistributionAgent
- Identifies eligible creators based on staking
- Calculates reward distribution
- Proportional rewards based on stake
- Configurable distribution threshold

### NameServiceAgent
- Caches name registrations
- Real-time event listening
- Bidirectional resolution (name ↔ address)
- Reduces RPC calls through caching

## Usage

### For Viewers

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask
2. **Join Room**: Enter room ID and user ID
3. **Watch Stream**: View live stream content
4. **Send Tips**: Click "Tip Creator" and send ETH with optional message

### For Creators

1. **Register**: Call `registerAsCreator()` on StreamTipping contract
2. **Start Stream**: Create room and share room ID
3. **Receive Tips**: Tips automatically sent to your wallet (minus 2.5% fee)
4. **Track Stats**: View total tips and tip count

### For Developers

1. **Deploy Contracts**: Follow DEPLOYMENT_GUIDE.md
2. **Configure Agents**: Set up agent wallet and parameters
3. **Run Agents**: Start agent system with `node agents/runAgents.js`
4. **Monitor**: Check agent logs and Etherscan for activity

## Configuration

### Environment Variables

```bash
# ZegoCloud
VITE_ZEGOCLOUD_APP_ID=
VITE_ZEGOCLOUD_SERVER_SECRET=

# Network
VITE_RPC_URL=https://rpc.sepolia.org
VITE_CHAIN_ID=11155111

# Contracts
VITE_STREAM_TIPPING_ADDRESS=
VITE_MATE_INTEGRATION_ADDRESS=
VITE_EXECUTOR_ADDRESS=

# MATE Services
VITE_MATE_NAME_SERVICE_ADDRESS=
VITE_MATE_STAKING_ADDRESS=
VITE_MATE_P2P_SWAP_ADDRESS=

# Platform
VITE_PLATFORM_WALLET=

# Agents
AGENT_PRIVATE_KEY=
AGENT_TIP_THRESHOLD=0.1
AGENT_REWARD_POOL=1.0
```

## Testing

### Manual Testing
1. Connect wallet to Sepolia
2. Register as creator
3. Send test tip
4. Verify on Etherscan
5. Check agent logs

### Contract Testing
```bash
npx hardhat test
```

## Security

- Private keys stored in environment variables (never committed)
- Platform wallet should use multisig in production
- Agent wallets should have limited funds
- Contracts should be audited before mainnet deployment
- Rate limiting on agent operations

## Performance

- Async nonces enable parallel transactions
- Executor batching reduces gas costs
- Agent caching minimizes RPC calls
- Optimized contract storage patterns

## Roadmap

- [ ] Mainnet deployment
- [ ] Additional MATE service integrations
- [ ] Subscription tiers
- [ ] NFT rewards for supporters
- [ ] Creator dashboard
- [ ] Revenue sharing pools
- [ ] Mobile app
- [ ] Content moderation agents
- [ ] Analytics dashboard

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License

## Support

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## Acknowledgments

- MATE Metaprotocol team
- EVVM community
- ZegoCloud for streaming infrastructure
- Chiliz ecosystem