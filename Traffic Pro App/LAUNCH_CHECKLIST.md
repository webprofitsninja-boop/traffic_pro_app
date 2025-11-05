# 🚀 Launch Checklist - Step by Step

## ✅ Step 1: Database Setup (5 minutes)

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste `scripts/01-database-setup.sql`
3. Click "Run" to execute
4. Verify tables created in Database → Tables

## ✅ Step 2: Edge Functions (Already Deployed)

Your edge functions are already deployed:
- ✓ create-checkout-session
- ✓ manage-subscription
- ✓ get-billing-info
- ✓ track-analytics
- ✓ send-analytics-report
- ✓ scheduled-report-sender
- ✓ generate-analytics-pdf
- ✓ track-ab-test-event
- ✓ calculate-ab-significance
- ✓ send-team-notification
- ✓ manage-campaign-permissions
- ✓ manage-custom-roles

## ✅ Step 3: Verify Supabase Secrets

Check in Supabase Dashboard → Project Settings → Edge Functions → Secrets:
- ✓ VITE_STRIPE_PUBLISHABLE_KEY
- ✓ STRIPE_SECRET_KEY
- ✓ SENDGRID_API_KEY

## ✅ Step 4: Deploy to Vercel

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option B: Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect Vite settings
4. Click "Deploy"

### Add Environment Variables in Vercel:
Go to Project Settings → Environment Variables and add:
```
VITE_SUPABASE_URL=https://bzgjelifmzgcvkcdpywa.supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
VITE_STRIPE_PUBLISHABLE_KEY=[already-set-in-supabase]
```

## ✅ Step 5: Configure Stripe Products

1. Go to Stripe Dashboard → Products
2. Create three products:

**Starter Plan**
- Name: Starter
- Price: $29/month
- Recurring: Monthly
- Copy Product ID

**Pro Plan**
- Name: Pro
- Price: $99/month
- Recurring: Monthly
- Copy Product ID

**Enterprise Plan**
- Name: Enterprise
- Price: $299/month
- Recurring: Monthly
- Copy Product ID

## ✅ Step 6: Set Up Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://bzgjelifmzgcvkcdpywa.supabase.co/functions/v1/create-checkout-session`
4. Select events:
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - checkout.session.completed
5. Click "Add endpoint"
6. Copy webhook signing secret

## ✅ Step 7: Set Up Cron Jobs

1. Go to Supabase Dashboard → SQL Editor
2. Open `scripts/02-cron-jobs.sql`
3. Replace `YOUR_SUPABASE_URL` with: `https://bzgjelifmzgcvkcdpywa.supabase.co`
4. Run the script
5. Verify: `SELECT * FROM cron.job;`

## ✅ Step 8: Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as shown
4. SSL will be automatically configured

## 🎉 Post-Launch Testing

- [ ] Visit your Vercel URL
- [ ] Sign up for a new account
- [ ] Create a test campaign
- [ ] Verify analytics tracking
- [ ] Test subscription upgrade
- [ ] Check email reports work
- [ ] Test A/B testing features
- [ ] Verify team collaboration

## 📊 Monitoring

- Supabase Logs: Dashboard → Logs
- Vercel Analytics: Dashboard → Analytics
- Stripe Dashboard: Monitor subscriptions
- SendGrid: Check email delivery stats

---

**Need Help?** Check DEPLOYMENT.md for troubleshooting tips!
