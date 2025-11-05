# 📊 Analytics SaaS Platform

A comprehensive analytics platform for tracking and optimizing marketing campaigns across multiple platforms.

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with Supabase
- 📈 **Real-Time Analytics** - Track campaigns, traffic, conversions
- 💳 **Subscription Management** - Stripe integration with 3 tiers
- 📧 **Automated Reports** - Weekly/monthly PDF reports via email
- 🔗 **URL Shortening** - Track clicks with custom short links
- 🌍 **Geographic Insights** - See where traffic comes from
- 📱 **Multi-Platform** - Google Ads, Facebook, TikTok, LinkedIn
- 📊 **Advanced Charts** - Conversion funnels, time-series, device stats
- 🎯 **Feature Gating** - Plan-based limits and access control

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase and Stripe keys

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Deploy to Vercel/Netlify
- [Testing Guide](TESTING.md) - Run and write tests
- [Cron Setup](CRON_SETUP.md) - Configure scheduled reports

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **Payments**: Stripe
- **Email**: SendGrid
- **Charts**: Recharts
- **PDF**: jsPDF
- **Testing**: Vitest, Testing Library

## 📦 Project Structure

```
src/
├── components/       # React components
├── pages/           # Page components
├── contexts/        # React contexts (Auth, App)
├── hooks/           # Custom hooks
├── lib/             # Utilities (Supabase, utils)
└── tests/           # Test files
```

## 🔑 Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## 📊 Pricing Plans

- **Free**: 1 campaign, 1K events/month
- **Starter** ($29/mo): 10 campaigns, 50K events
- **Pro** ($99/mo): 50 campaigns, 500K events
- **Enterprise** ($299/mo): Unlimited

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

- Documentation: See docs folder
- Issues: GitHub Issues
- Email: support@yourplatform.com

## 🎯 Roadmap

- [ ] A/B testing
- [ ] Team collaboration
- [ ] Custom dashboards
- [ ] API access
- [ ] White-label options
