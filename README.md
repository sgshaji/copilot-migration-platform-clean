
# M365 Copilot Migration Platform

*Now running on Replit for seamless AI-powered bot migration*

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Powered by Replit](https://img.shields.io/badge/Powered%20by-Replit-orange?style=for-the-badge&logo=replit)](https://replit.com/)

## Overview

An intelligent platform for migrating legacy chatbots to Microsoft 365 Copilot Studio with AI-powered analysis and automated deployment to Botpress.

## Features

- 🤖 **AI-Powered Analysis**: Analyze legacy bots and generate improvement recommendations
- 🚀 **One-Click Migration**: Deploy upgraded agents to Botpress with webhook integration
- 📊 **Delta Analysis**: Compare before/after capabilities with ROI calculations
- 🔗 **Microsoft Integration**: Seamless connection to M365 Copilot Studio
- 🎯 **Domain-Specific**: HR, IT, and Sales specialized transformations

## Getting Started

1. **Environment Setup**: Add your API keys to Replit Secrets:
   - `BOTPRESS_TOKEN` - Get free token from [botpress.com](https://botpress.com)
   - `HUGGINGFACE_API_KEY` - Get free token from [huggingface.co](https://huggingface.co)

2. **Run the Application**: Click the Run button or use:
   ```bash
   npm run dev
   ```

3. **Start Migration**: Navigate to `/migration` and upload your bot configuration

## Deployment

This application is optimized for Replit deployment with:
- Automatic port configuration (3001)
- Built-in secrets management
- Zero-config database (Replit DB)
- One-click deployment to production

## API Integrations

- **Botpress Cloud**: Real bot deployment and webhook integration
- **Hugging Face**: Free AI analysis and transformation
- **Microsoft Graph**: M365 integration (100k requests/month free)
- **Replit Database**: Persistent storage for agent configurations

## Architecture

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **AI Services**: Hugging Face Transformers for analysis
- **Deployment**: Botpress Cloud with webhook integration
- **Database**: Replit DB for configuration storage
- **Hosting**: Replit with automatic scaling
