import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { CreditCard, Download, Calendar, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethodCard } from './PaymentMethodCard';

export function BillingPage() {
  const [billing, setBilling] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBillingInfo();
  }, []);

  const loadBillingInfo = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-billing-info', {
        body: { customerId: 'cus_demo123' }
      });
      if (!error) setBilling(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async (action: string, subId: string, planName?: string, planPrice?: number) => {
    try {
      await supabase.functions.invoke('manage-subscription', {
        body: { action, subscriptionId: subId, planName, planPrice }
      });
      toast({ title: 'Success', description: 'Subscription updated successfully' });
      loadBillingInfo();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update subscription', variant: 'destructive' });
    }
  };

  const downloadInvoice = (invoiceUrl: string) => {
    window.open(invoiceUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Billing & Subscription</h1>
        </div>

        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="bg-white/10">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="invoices">Billing History</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Current Plan</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-3xl font-bold text-white">Professional Plan</h3>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    <p className="text-2xl text-purple-400 font-semibold mb-2">$49/month</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Trial ends on Dec 31, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Next billing date: Jan 1, 2026</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => handleManageSubscription('cancel', 'sub_demo123')}
                  >
                    Cancel Subscription
                  </Button>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Upgrade or Downgrade</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { name: 'Starter', price: 19, features: ['10K clicks/mo', 'Basic analytics'] },
                      { name: 'Professional', price: 49, features: ['50K clicks/mo', 'Advanced analytics'], current: true },
                      { name: 'Enterprise', price: 149, features: ['Unlimited clicks', 'Premium support'] }
                    ].map((plan) => (
                      <Card key={plan.name} className={`bg-white/5 border ${plan.current ? 'border-purple-500' : 'border-white/10'}`}>
                        <CardContent className="p-4">
                          <h5 className="text-white font-bold mb-2">{plan.name}</h5>
                          <p className="text-2xl text-purple-400 font-semibold mb-3">${plan.price}/mo</p>
                          <ul className="space-y-1 mb-4">
                            {plan.features.map((f, i) => (
                              <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                {f}
                              </li>
                            ))}
                          </ul>
                          {!plan.current && (
                            <Button 
                              size="sm" 
                              className="w-full"
                              onClick={() => handleManageSubscription(
                                plan.price > 49 ? 'upgrade' : 'downgrade',
                                'sub_demo123',
                                plan.name,
                                plan.price
                              )}
                            >
                              {plan.price > 49 ? 'Upgrade' : 'Downgrade'}
                            </Button>
                          )}
                          {plan.current && (
                            <Badge className="w-full justify-center">Current Plan</Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Payment Methods</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PaymentMethodCard
                  brand="visa"
                  last4="4242"
                  expMonth={12}
                  expYear={2026}
                  isDefault={true}
                  onRemove={() => toast({ title: 'Removed', description: 'Payment method removed' })}
                  onSetDefault={() => {}}
                />
                <PaymentMethodCard
                  brand="mastercard"
                  last4="8888"
                  expMonth={6}
                  expYear={2027}
                  isDefault={false}
                  onRemove={() => toast({ title: 'Removed', description: 'Payment method removed' })}
                  onSetDefault={() => toast({ title: 'Updated', description: 'Default payment method updated' })}
                />
                <Button className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Billing History</CardTitle>
                <CardDescription className="text-gray-400">
                  View and download your invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: 'Dec 1, 2025', amount: 49, status: 'paid', invoice: 'INV-001' },
                    { date: 'Nov 1, 2025', amount: 49, status: 'paid', invoice: 'INV-002' },
                    { date: 'Oct 1, 2025', amount: 49, status: 'paid', invoice: 'INV-003' }
                  ].map((inv) => (
                    <div key={inv.invoice} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-4">
                        <DollarSign className="h-8 w-8 text-green-400" />
                        <div>
                          <p className="text-white font-semibold">{inv.invoice}</p>
                          <p className="text-sm text-gray-400">{inv.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-white font-semibold">${inv.amount}.00</p>
                          <Badge variant={inv.status === 'paid' ? 'default' : 'secondary'}>
                            {inv.status}
                          </Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadInvoice(`https://invoice.stripe.com/${inv.invoice}`)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

