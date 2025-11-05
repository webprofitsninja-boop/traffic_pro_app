import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Zap, Shield, Globe, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            🚀 Track, Analyze, Optimize
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics That Drive Results
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Track campaigns across all platforms. Get actionable insights. Grow your business with data-driven decisions.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')} className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-4">No credit card required • 14-day free trial</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track performance as it happens with live dashboards' },
            { icon: TrendingUp, title: 'Conversion Tracking', desc: 'Monitor ROI and optimize campaigns for maximum impact' },
            { icon: Zap, title: 'Multi-Platform', desc: 'Connect Google Ads, Facebook, TikTok, and more' },
            { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level encryption and compliance' },
            { icon: Globe, title: 'Geographic Insights', desc: 'See where your traffic comes from worldwide' },
            { icon: Users, title: 'Team Collaboration', desc: 'Share reports and insights with your team' },
          ].map((feature, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of marketers making data-driven decisions</p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/signup')}>
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
}
