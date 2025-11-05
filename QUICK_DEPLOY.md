# ⚡ Quick Deploy Guide (10 Minutes)

## Prerequisites Checklist
- [x] Supabase account (already set up)
- [x] Stripe account (already set up)  
- [x] SendGrid account (already set up)
- [ ] Vercel account (need to create)

---

## 🎯 3-Step Launch

### STEP 1: Run Database Scripts (2 min)
```bash
# In Supabase Dashboard → SQL Editor, run these in order:
1. scripts/01-database-setup.sql
2. scripts/03-stripe-webhook-handler.sql
```

### STEP 2: Deploy to Vercel (5 min)
```bash
# Install Vercel CLI
npm install -g vercel

# Login (creates account if needed)
vercel login

# Deploy
vercel --prod

# Add environment variables when prompted:
# VITE_SUPABASE_URL=https://bzgjelifmzgcvkcdpywa.supabase.co
# VITE_SUPABASE_ANON_KEY=[get from Supabase Dashboard]
# VITE_STRIPE_PUBLISHABLE_KEY=[get from Stripe Dashboard]
```

### STEP 3: Set Up Cron Jobs (3 min)
```bash
# In Supabase SQL Editor:
# 1. Open scripts/02-cron-jobs.sql
# 2. Replace YOUR_SUPABASE_URL with: https://bzgjelifmzgcvkcdpywa.supabase.co
# 3. Run the script
```

---

## 🎉 You're Live!

Your app is now deployed at: `https://your-project.vercel.app`

### Next Steps (Optional):
1. **Stripe Products**: Create 3 products ($29, $99, $299/mo)
2. **Stripe Webhook**: Add endpoint to receive subscription events
3. **Custom Domain**: Add in Vercel settings

---

## 📝 Where to Find Keys

**Supabase Anon Key:**
Supabase Dashboard → Settings → API → `anon` `public`

**Stripe Publishable Key:**
Stripe Dashboard → Developers → API Keys → Publishable key

**Your Vercel URL:**
After deployment, Vercel CLI will show the URL

---

## 🆘 Troubleshooting

**"Vercel command not found"**
```bash
npm install -g vercel
```

**"Missing environment variables"**
Add them in Vercel Dashboard → Project → Settings → Environment Variables

**"Database error"**
Make sure you ran scripts/01-database-setup.sql first
