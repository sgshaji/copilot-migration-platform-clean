# Free Tier Infrastructure Setup Guide

## 🚀 Step 1: Production Infrastructure with Free Tiers

This guide shows you how to deploy your Copilot agents using **100% free infrastructure** that scales to production workloads.

### Key Infrastructure Components

#### 1. **Hosting: Vercel (Free Tier)**
- **Bandwidth**: 100GB/month
- **Build Minutes**: 6000 minutes/month  
- **Serverless Functions**: 100GB-hours/month
- **SSL**: Automatic HTTPS
- **CDN**: Global edge network
- **Auto-scaling**: Built-in

**Setup Steps:**
1. Create account at [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Deploy automatically on push
4. Get custom domain with SSL

#### 2. **Database: Supabase (Free Tier)**
- **Storage**: 500MB
- **Bandwidth**: 2GB/month
- **Connections**: 20 concurrent
- **Backups**: Automatic daily
- **Real-time**: WebSocket support

**Setup Steps:**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string
4. Set environment variables

#### 3. **AI Services: OpenAI (Free Tier)**
- **Requests**: 3 requests/minute
- **Tokens**: 4000 tokens/request
- **Models**: GPT-3.5-turbo, GPT-4
- **Rate Limiting**: Built-in

**Setup Steps:**
1. Create account at [openai.com](https://openai.com)
2. Get API key
3. Set `OPENAI_API_KEY` environment variable
4. Configure rate limiting

#### 4. **Monitoring: Vercel Analytics (Free Tier)**
- **Events**: 100,000 events/month
- **Retention**: 30 days
- **Real-time**: Live dashboards
- **Alerts**: Custom notifications

**Setup Steps:**
1. Enable in Vercel dashboard
2. Add tracking code
3. Configure events
4. Set up alerts

### Environment Variables Setup

Create a `.env.local` file:

```bash
# Vercel (Auto-detected)
VERCEL_URL=your-app.vercel.app

# Supabase Database
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI AI Services
OPENAI_API_KEY=your-openai-api-key

# Application
NODE_ENV=production
PORT=3000
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### Database Schema Setup

The infrastructure automatically creates these production tables:

```sql
-- Agents table
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  configuration JSONB,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent configurations
CREATE TABLE agent_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  config_type VARCHAR(100),
  config_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  messages JSONB,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User sessions
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255),
  session_data JSONB,
  last_activity TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100),
  event_data JSONB,
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Delta scenarios
CREATE TABLE delta_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  category VARCHAR(100),
  description TEXT,
  business_value JSONB,
  technical_implementation JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Migration logs
CREATE TABLE migration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  migration_type VARCHAR(100),
  status VARCHAR(50),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Production Deployment Checklist

#### ✅ Pre-Deployment
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] AI API key validated
- [ ] SSL certificate ready
- [ ] Domain configured

#### ✅ Deployment
- [ ] Code pushed to repository
- [ ] Vercel deployment triggered
- [ ] Database migrations run
- [ ] Health checks passing
- [ ] Monitoring enabled

#### ✅ Post-Deployment
- [ ] Live URL accessible
- [ ] SSL certificate active
- [ ] Database connected
- [ ] AI services responding
- [ ] Analytics tracking

### Free Tier Limits & Scaling

#### Current Free Limits
- **Hosting**: 100GB bandwidth, 6000 build minutes
- **Database**: 500MB storage, 2GB bandwidth
- **AI**: 3 requests/minute, 4000 tokens/request
- **Monitoring**: 100k events/month

#### When to Upgrade
- **Hosting**: >100GB bandwidth or >6000 build minutes
- **Database**: >500MB storage or >2GB bandwidth
- **AI**: >3 requests/minute or >4000 tokens/request
- **Monitoring**: >100k events/month

#### Scaling Path
1. **Start**: Free tiers (sufficient for MVP)
2. **Grow**: Paid tiers as needed
3. **Scale**: Enterprise solutions for large deployments

### Cost Comparison

| Service | Free Tier | Paid Tier | Enterprise |
|---------|-----------|-----------|------------|
| **Vercel** | $0/month | $20/month | Custom |
| **Supabase** | $0/month | $25/month | Custom |
| **OpenAI** | $0/month | Pay-per-use | Custom |
| **Analytics** | $0/month | $25/month | Custom |
| **Total** | **$0/month** | **~$70/month** | **Custom** |

### Security Best Practices

#### Environment Variables
- Never commit API keys to repository
- Use Vercel environment variables
- Rotate keys regularly
- Use least privilege access

#### Database Security
- Enable Row Level Security (RLS)
- Use connection pooling
- Regular backups
- Monitor access logs

#### API Security
- Rate limiting enabled
- Input validation
- CORS configured
- HTTPS only

### Monitoring & Alerts

#### Key Metrics to Track
- **Uptime**: 99.9% target
- **Response Time**: <200ms average
- **Error Rate**: <1% target
- **API Usage**: Monitor rate limits

#### Alert Setup
- **Uptime**: Down for >5 minutes
- **Errors**: >5% error rate
- **Performance**: >500ms response time
- **Usage**: >80% of free tier limits

### Troubleshooting

#### Common Issues

**1. Database Connection Failed**
```bash
# Check environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Test connection
curl -X GET "https://your-project.supabase.co/rest/v1/agents" \
  -H "apikey: your-anon-key"
```

**2. AI Service Not Responding**
```bash
# Check API key
echo $OPENAI_API_KEY

# Test API call
curl -X POST "https://api.openai.com/v1/chat/completions" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"Hello"}]}'
```

**3. Deployment Failed**
```bash
# Check Vercel logs
vercel logs

# Check build output
vercel build

# Verify environment variables
vercel env ls
```

### Next Steps

After infrastructure is set up:

1. **Test the deployment** - Verify all services are working
2. **Configure monitoring** - Set up alerts and dashboards  
3. **Deploy your first agent** - Use the migration engine
4. **Monitor performance** - Track usage and optimize
5. **Scale as needed** - Upgrade when approaching limits

### Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **OpenAI Docs**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **Community**: [GitHub Discussions](https://github.com/your-repo/discussions)

---

**🎉 Congratulations!** You now have a production-ready infrastructure using 100% free tiers that can scale with your Copilot agent business. 