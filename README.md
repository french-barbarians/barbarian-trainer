# 🏃‍♂️ MyPrivatCoach

> **Your AI Running Coach with Confidential Data Protection**

MyPrivatCoach is a revolutionary AI-powered running coach that leverages **iExec's decentralized confidential computing platform** to provide personalized training advice while ensuring your GPS workout data remains completely private and secure.

## 🎯 What is MyPrivatCoach?

MyPrivatCoach combines the power of AI coaching with blockchain-based data protection. Upload your GPX workout files, and our AI coach (powered by a custom fine-tuned model) analyzes your training data in a secure, trusted execution environment to provide personalized training plans and advice.

### Key Features

- 🔒 **Complete Data Privacy**: Your GPX files are encrypted and processed in secure enclaves
- 🤖 **AI-Powered Coaching**: Custom fine-tuned AI model specialized in running coaching
- 📊 **Advanced Analytics**: Comprehensive workout analysis with detailed statistics
- 🌐 **Decentralized Infrastructure**: Built on iExec's confidential computing platform
- 📱 **Modern Web Interface**: Beautiful, responsive UI built with Next.js

## 🏗️ Architecture

The application consists of three main components:

### 1. Frontend (`/front`)
- **Next.js 15** with TypeScript
- **Reown AppKit** for wallet connectivity
- **iExec DataProtector** for data encryption
- **Tailwind CSS** for styling
- **Wagmi** for Ethereum interactions

### 2. iApp Backend (`/iapp/barbarian-trainer`)
- **Node.js** serverless application
- **iExec TEE** (Trusted Execution Environment)
- **Ollama** integration for AI model inference
- **GPX parsing** and analytics
- **Secure tunnel** for real-time communication

### 3. AI Model (`/model`)
- **Custom Ollama model**: `thewhitewizard/teddy:3b`
- **Fine-tuned Qwen2.5:3B** for running coaching
- **French language optimization**
- **Structured training plan generation**

## 📖 How It Works

### 1. Data Protection
1. Connect your wallet
2. Upload your GPX workout files
3. Data is encrypted using iExec DataProtector
4. Protected data is stored on the blockchain

### 2. AI Processing
1. Grant access to the MyPrivatCoach iApp
2. Your encrypted data is processed in a secure TEE
3. AI model analyzes your training patterns
4. Personalized coaching advice is generated

### 3. Results
1. Receive detailed training analysis
2. Get personalized training plans
