# 🚀 Get Your Free API Keys - Step by Step Guide

## 🎯 Overview
This guide will help you get **real API keys** for **$0 cost** to deploy your Copilot agent app with free hosting.

## 📋 What You'll Get (All Free)

| Service | What You Get | Cost |
|---------|-------------|------|
| **OpenAI** | $5 free credits + API access | $0 |
| **Supabase** | 500MB database + real-time | $0 |
| **Vercel** | 100GB hosting + SSL | $0 |
| **Analytics** | 100k events/month | $0 |

---

## 🔑 Step 1: Get OpenAI API Key (5 minutes)

### 1.1 Create OpenAI Account
1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Click "Sign up"
3. Enter your email and create password
4. **No credit card required!**

### 1.2 Get Free Credits
- ✅ You automatically get **$5 free credits**
- ✅ This is enough for **thousands of API calls**
- ✅ No payment method needed

### 1.3 Create API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Give it a name like "Copilot Agent App"
4. Click "Create secret key"
5. **Copy the key** (starts with `sk-`)

### 1.4 Test Your Key
```bash
curl -X POST "https://api.openai.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"Hello"}]}'
```

---

## 🗄️ Step 2: Get Supabase Database (5 minutes)

### 2.1 Create Supabase Account
1. Go to [https://supabase.com/signup](https://supabase.com/signup)
2. Click "Start your project"
3. Sign up with GitHub or email
4. **No credit card required!**

### 2.2 Create New Project
1. Click "New Project"
2. Choose your organization
3. Enter project name: "copilot-agent-app"
4. Enter database password (save this!)
5. Choose region closest to you
6. Click "Create new project"

### 2.3 Get Connection Details
1. Wait for project to be ready (2-3 minutes)
2. Go to Settings → API
3. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon public key**: `eyJ...` (long string)
   - **Service role key**: `eyJ...` (long string)

### 2.4 Test Connection
```bash
curl -X GET "https://your-project.supabase.co/rest/v1/agents" \
  -H "apikey: YOUR_ANON_KEY"
```

---

## 🌐 Step 3: Deploy to Vercel (5 minutes)

### 3.1 Create Vercel Account
1. Go to [https://vercel.com/signup](https://vercel.com/signup)
2. Click "Continue with GitHub"
3. Authorize Vercel
4. **No credit card required!**

### 3.2 Push Code to GitHub
1. Create new GitHub repository
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/copilot-agent-app.git
git push -u origin main
```

### 3.3 Deploy to Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Click "Deploy"
4. Wait 2-3 minutes for deployment

### 3.4 Add Environment Variables
1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add these variables:
   ```
   OPENAI_API_KEY=sk-your-openai-key
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Click "Save"
5. Redeploy your app

---

## ✅ Step 4: Verify Everything Works

### 4.1 Test Your Live App
1. Go to your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Navigate to `/setup` to see the setup guide
3. Test the infrastructure initialization

### 4.2 Check API Connections
1. **OpenAI**: Test AI responses
2. **Supabase**: Check database connection
3. **Vercel**: Verify hosting is working

### 4.3 Monitor Usage
- **OpenAI**: Check usage at [platform.openai.com/usage](https://platform.openai.com/usage)
- **Supabase**: Monitor at your project dashboard
- **Vercel**: Check analytics in dashboard

---

## 🔧 Troubleshooting

### OpenAI Issues
**Problem**: "Invalid API key"
**Solution**: 
- Make sure key starts with `sk-`
- Check for extra spaces
- Verify account is active

**Problem**: "Rate limit exceeded"
**Solution**:
- Free tier: 3 requests/minute
- Wait 1 minute between requests
- Consider upgrading if needed

### Supabase Issues
**Problem**: "Connection failed"
**Solution**:
- Check URL format: `https://project.supabase.co`
- Verify API keys are correct
- Check if project is active

**Problem**: "Database not found"
**Solution**:
- Wait for project to fully initialize
- Check project status in dashboard
- Verify region selection

### Vercel Issues
**Problem**: "Build failed"
**Solution**:
- Check environment variables are set
- Verify all dependencies are installed
- Check build logs for errors

**Problem**: "Environment variables not found"
**Solution**:
- Add variables in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly

---

## 💰 Cost Breakdown

### What You Pay: $0
- ✅ OpenAI: $5 free credits (no card needed)
- ✅ Supabase: 500MB free database
- ✅ Vercel: 100GB free hosting
- ✅ Analytics: 100k free events

### When You Might Pay Later
- **OpenAI**: After $5 credits (pay-per-use)
- **Supabase**: After 500MB storage
- **Vercel**: After 100GB bandwidth
- **Analytics**: After 100k events

### Typical Costs for Growth
- **Small app**: $0-10/month
- **Medium app**: $10-50/month  
- **Large app**: $50-200/month

---

## 🎉 Success Checklist

- [ ] OpenAI account created with $5 credits
- [ ] API key generated and tested
- [ ] Supabase project created
- [ ] Database connection details saved
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] App deployed to Vercel
- [ ] Environment variables added
- [ ] Live app working correctly
- [ ] API connections tested
- [ ] Monitoring set up

---

## 🚀 Next Steps

After getting your API keys:

1. **Test the app** - Make sure everything works
2. **Customize** - Add your own branding and features
3. **Deploy agents** - Use the migration engine
4. **Monitor usage** - Keep track of API calls
5. **Scale up** - Upgrade when you hit limits

---

## 📞 Need Help?

- **OpenAI Support**: [help.openai.com](https://help.openai.com)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **GitHub Issues**: Create issue in your repository

---

**🎯 You're all set!** Your Copilot agent app is now live with real APIs for $0/month. 