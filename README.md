# 🎬 StreamIt - Decentralized Live Streaming on EVVM

> **Stream. Tip. Earn.** The first Web3 live streaming platform powered by EVVM blockchain and MATE Metaprotocol.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://streamit-i63ytbxyr-snehas-projects-5edc1d05.vercel.app)
[![EVVM](https://img.shields.io/badge/Built%20on-EVVM-purple?style=for-the-badge)](https://evvm.dev)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**StreamIt** revolutionizes content creation by enabling creators to stream live and receive instant crypto tips from their audience—all powered by blockchain technology with gasless transactions and autonomous agents.

## 🌟 Why StreamIt?

### 🎯 The Problem
Traditional streaming platforms take **30-50% of creator earnings**, have opaque payment systems, and can ban creators arbitrarily. Creators need a decentralized alternative where they truly own their content and earnings.

### 💡 Our Solution
StreamIt leverages **EVVM blockchain** to provide:
- ✅ **Instant Tips** - Viewers tip creators directly with crypto
- ✅ **Zero Platform Fees** - Only 2.5% fee (vs 30-50% on Web2)
- ✅ **True Ownership** - Creators control their content and wallet
- ✅ **Gasless Transactions** - EVVM's async nonces enable parallel tipping
- ✅ **Autonomous Agents** - x402 agents monitor and distribute rewards automatically

## ✨ Features

### 🎥 For Creators
- **HD Live Streaming** - Powered by ZegoCloud infrastructure
- **Creator Dashboard** - Track earnings, tips, and audience stats
- **Instant Payouts** - Tips sent directly to your wallet
- **Username Registration** - Register @username via MATE Name Service
- **Leaderboard** - Compete for top creator spots

### 👀 For Viewers
- **Browse Live Streams** - Discover creators streaming now
- **Dual Tipping System** - Tip with ETH or EVVM MATE tokens
- **Username Display** - See creator names instead of addresses
- **Top Creators** - Follow the leaderboard and support your favorites

### 🤖 x402 Autonomous Agents
- **TipMonitorAgent** - Monitors all tips and creator performance in real-time
- **RewardDistributionAgent** - Automatically distributes rewards to top creators
- **NameServiceAgent** - Caches MATE usernames for fast resolution

## 📜 Deployed Smart Contracts (Sepolia Testnet)

| Contract | Address | Purpose |
|----------|---------|----------|
| **StreamTipping** | `0x49C31b473C3EfBe8F5384eB7b77C257A961C8Fc8` | Main tipping contract with creator registration |
| **EVVM Core** | `0x5c66EB3CAAD38851C9c6291D77510b0Eaa8B3c84` | EVVM protocol core for gasless transactions |
| **MATE Name Service** | `0x7F41487e77D092BA53c980171C4ebc71d68DC5AE` | Username registration and resolution |
| **MATE Staking** | `0x0fb1aD66636411bB50a33458a8De6507D9b270E8` | Staking rewards for creators |

[View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x49C31b473C3EfBe8F5384eB7b77C257A961C8Fc8)

## 🛠️ Technology Stack

**Frontend**
- React 19 + Vite 6 - Lightning-fast development
- TailwindCSS 4 - Modern, responsive UI
- ethers.js 6 - Ethereum interactions
- ZegoCloud - HD live streaming

**Blockchain**
- EVVM (Ethereum Virtual Virtual Machine)
- Sepolia Testnet
- MATE Metaprotocol
- Async Nonces for parallel transactions

**Smart Contracts**
- StreamTipping - Creator registration & tipping
- AsyncNonceManager - Parallel transaction support
- Executor - Batched operations
- MATE Integration - Name service & staking

**x402 Agents**
- Node.js autonomous agents
- Event-driven monitoring
- Automatic reward distribution

## 🚀 Quick Start

### 1️⃣ Try the Live Demo
👉 **[Launch StreamIt](https://streamit-i63ytbxyr-snehas-projects-5edc1d05.vercel.app)**

1. Connect your MetaMask wallet (Sepolia network)
2. Choose "Watch Streams" or "Start Streaming"
3. Register as a creator in the Creator Dashboard
4. Start streaming or tip your favorite creators!

### 2️⃣ Run Locally

```bash
# Clone the repository
git clone https://github.com/snehasharma76/EthGlobalBAEVVM.git
cd EthGlobalBAEVVM/LiveStreamingApp

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your ZegoCloud credentials to .env

# Start development server
npm run dev
```

### 3️⃣ Run x402 Agents (Optional)

```bash
# Add agent private key to .env
AGENT_PRIVATE_KEY=your_private_key

# Start agents
npm run agents
```

## 📋 How It Works

### For Creators
```mermaid
Creator → Register → Start Stream → Receive Tips → Earn ETH/MATE
```

1. **Register** - Call `registerCreator()` on StreamTipping contract
2. **Stream** - Start live stream with ZegoCloud
3. **Earn** - Receive tips directly to your wallet (97.5% after 2.5% fee)
4. **Compete** - Climb the leaderboard to attract more viewers

### For Viewers
```mermaid
Viewer → Browse Streams → Watch → Tip Creator → Support Content
```

1. **Browse** - Discover live streams on the platform
2. **Watch** - Enjoy HD live content
3. **Tip** - Send ETH or MATE tokens to creators
4. **Engage** - See your favorite creators on the leaderboard

## 🎯 Use Cases

### 🎮 Gaming Streamers
- Stream gameplay and receive instant tips
- Build community with leaderboard competition
- No platform taking 50% of your earnings

### 🎵 Musicians & Artists
- Live performances with direct fan support
- Register @username for brand identity
- Keep 97.5% of all tips received

### 📚 Educational Content
- Live coding sessions and tutorials
- Receive tips for valuable knowledge sharing
- Autonomous agents track your performance

### 🗣️ Community Events
- Host AMAs and community calls
- Transparent tipping visible on-chain
- Decentralized and censorship-resistant

## 🔑 Key Innovations

### ⚡ Async Nonces
EVVM's async nonces allow **parallel transactions** - multiple viewers can tip simultaneously without waiting for sequential nonce ordering. This creates a seamless UX impossible on traditional blockchains.

### 🤖 x402 Autonomous Agents
Smart agents run 24/7 monitoring tips, distributing rewards, and caching usernames. They operate independently, making the platform truly decentralized.

### 💰 Dual Payment System
- **ETH Tipping** - Traditional blockchain payments
- **EVVM MATE Tipping** - Gasless transactions with MATE tokens

Viewers choose their preferred payment method!

## 🔧 Environment Setup

```bash
# Required
VITE_ZEGOCLOUD_APP_ID=your_zegocloud_app_id
VITE_ZEGOCLOUD_SERVER_SECRET=your_zegocloud_secret
VITE_RPC_URL=https://rpc.sepolia.org
VITE_STREAM_TIPPING_ADDRESS=0x49C31b473C3EfBe8F5384eB7b77C257A961C8Fc8

# Optional (for EVVM features)
VITE_EVVM_ADDRESS=0x5c66EB3CAAD38851C9c6291D77510b0Eaa8B3c84
VITE_NAME_SERVICE_ADDRESS=0x7F41487e77D092BA53c980171C4ebc71d68DC5AE
VITE_STAKING_ADDRESS=0x0fb1aD66636411bB50a33458a8De6507D9b270E8

# For running agents
AGENT_PRIVATE_KEY=your_agent_private_key
```

## 🛡️ Security

- ✅ All private keys stored in `.env` (never committed)
- ✅ Smart contracts deployed on Sepolia testnet
- ✅ Platform fee capped at 2.5%
- ✅ Direct wallet-to-wallet tipping
- ✅ Open source and auditable

## 📊 Stats

- **97.5%** of tips go directly to creators
- **0 gas fees** with EVVM MATE tipping
- **Parallel transactions** via async nonces
- **24/7 monitoring** by x402 agents

## 🚀 Roadmap

- [x] Live streaming with ZegoCloud
- [x] ETH tipping system
- [x] EVVM integration
- [x] Username registration
- [x] Creator leaderboard
- [x] x402 autonomous agents
- [ ] Mobile app
- [ ] NFT badges for top supporters
- [ ] Subscription tiers
- [ ] Multi-chain support

## 🤝 Contributing

We welcome contributions! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📝 License

MIT License - feel free to use this project for your own streaming platform!

## 👏 Built With

- [EVVM](https://evvm.dev) - Ethereum Virtual Virtual Machine
- [MATE Metaprotocol](https://evvm.dev) - Decentralized services
- [ZegoCloud](https://www.zegocloud.com/) - Live streaming infrastructure
- [Sepolia](https://sepolia.etherscan.io/) - Ethereum testnet

---

<div align="center">

**🎬 Start streaming on Web3 today!**

[Live Demo](https://streamit-i63ytbxyr-snehas-projects-5edc1d05.vercel.app) • [GitHub](https://github.com/snehasharma76/EthGlobalBAEVVM) • [EVVM Docs](https://evvm.dev)

Made with ❤️ for creators and powered by EVVM

</div>