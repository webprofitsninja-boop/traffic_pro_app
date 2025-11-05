import type { IncomingMessage, ServerResponse } from 'http';
import Stripe from 'stripe';
import getRawBody from 'raw-body';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2025-09-30.clover' as any });

export default async function handler(req: IncomingMessage & { method?: string; headers: Record<string, any>; }, res: ServerResponse & { statusCode: number; setHeader: (k: string, v: string) => void; end: (b?: any) => void; }) {
  if (req.method !== 'POST') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !endpointSecret) {
    res.statusCode = 400;
    res.end('Missing Stripe signature or endpoint secret');
    return;
  }

  let event: Stripe.Event;
  try {
    const raw = await getRawBody(req);
    event = await stripe.webhooks.constructEventAsync(raw, sig as string, endpointSecret);
  } catch (err: any) {
    res.statusCode = 400;
    res.end(Webhook Error: );
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: mark subscription active, provision access
        break;
      case 'invoice.payment_succeeded':
        // TODO: ensure account remains active
        break;
      case 'invoice.payment_failed':
        // TODO: notify customer or limit access
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // TODO: sync subscription status in your DB
        break;
      default:
        // No-op for other events
        break;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ received: true }));
  } catch (err: any) {
    res.statusCode = 500;
    res.end(Handler error: );
  }
}

