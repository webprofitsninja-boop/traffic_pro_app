# 🚀 Deployment Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account
- Stripe account
- SendGrid account

## 1. Supabase Setup

### Database Tables
Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT CHECK (plan_type IN ('free', 'starter', 'pro', 'enterprise')),
  status TEXT,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  platform TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns,
  user_id UUID REFERENCES auth.users,
  event_type TEXT,
  page_url TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shortened URLs
CREATE TABLE shortened_urls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  campaign_id UUID REFERENCES campaigns,
  short_code TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report schedules
CREATE TABLE report_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  frequency TEXT CHECK (frequency IN ('weekly', 'monthly')),
  email TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Edge Functions
Deploy edge functions:
```bash
supabase functions deploy send-analytics-report
supabase functions deploy scheduled-report-sender
supabase functions deploy generate-analytics-pdf
```

### Environment Variables
Set in Supabase Dashboard > Project Settings > Edge Functions:
```
SENDGRID_API_KEY=your_sendgrid_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 2. Frontend Deployment (Vercel)

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables
Add in Vercel Dashboard > Settings > Environment Variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## 3. Stripe Setup

1. Create products in Stripe Dashboard:
   - Starter Plan: $29/month
   - Pro Plan: $99/month
   - Enterprise Plan: $299/month

2. Create webhook endpoint:
   - URL: `https://your-supabase-url.supabase.co/functions/v1/stripe-webhook`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

3. Copy webhook secret to Supabase edge function env

## 4. Cron Jobs

Set up in Supabase Dashboard > Database > Cron:
```sql
-- Weekly reports (Mondays at 9 AM)
SELECT cron.schedule('weekly-reports', '0 9 * * 1', 'SELECT net.http_post(url:=''https://your-project.supabase.co/functions/v1/scheduled-report-sender'', body:=''{"frequency":"weekly"}'')');

-- Monthly reports (1st of month at 9 AM)
SELECT cron.schedule('monthly-reports', '0 9 1 * *', 'SELECT net.http_post(url:=''https://your-project.supabase.co/functions/v1/scheduled-report-sender'', body:=''{"frequency":"monthly"}'')');
```

## 5. DNS & Domain

1. Add custom domain in Vercel
2. Update DNS records as instructed
3. Enable SSL (automatic)

## 6. Post-Deployment Checklist

- [ ] Test user signup/login
- [ ] Create test campaign
- [ ] Verify analytics tracking
- [ ] Test subscription upgrade
- [ ] Send test email report
- [ ] Check PDF generation
- [ ] Verify cron jobs running
- [ ] Test all integrations
- [ ] Enable error monitoring (Sentry)
- [ ] Set up uptime monitoring

## Troubleshooting

### Edge Functions Not Working
- Check logs: `supabase functions logs send-analytics-report`
- Verify environment variables set
- Check CORS settings

### Analytics Not Tracking
- Verify Supabase anon key is correct
- Check browser console for errors
- Ensure RLS policies allow inserts

### Stripe Webhooks Failing
- Verify webhook secret matches
- Check endpoint URL is correct
- Review Stripe Dashboard > Webhooks logs

