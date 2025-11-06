import type { IncomingMessage, ServerResponse } from 'http'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-09-30.clover' as any,
})

function getPriceIdForPlan(planName: string | undefined): string | null {
  if (!planName) return null
  const key = planName.trim().toLowerCase()
  // Check both VITE_ prefixed (from Vercel env) and non-prefixed versions
  if (key.startsWith('basic')) return process.env.VITE_STRIPE_PRICE_BASIC || process.env.STRIPE_PRICE_BASIC || null
  if (key.startsWith('advanced') || key.startsWith('pro')) return process.env.VITE_STRIPE_PRICE_ADVANCED || process.env.STRIPE_PRICE_ADVANCED || null
  if (key.startsWith('enterprise')) return process.env.VITE_STRIPE_PRICE_ENTERPRISE || process.env.STRIPE_PRICE_ENTERPRISE || null
  return null
}

export default async function handler(
  req: IncomingMessage & { method?: string; headers: Record<string, any> } & { body?: any },
  res: ServerResponse & { statusCode: number; setHeader: (k: string, v: string) => void; end: (b?: any) => void }
) {
  try {
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.setHeader('Allow', 'POST')
      res.end('Method Not Allowed')
      return
    }

    // Read JSON body
    const buffers: Uint8Array[] = []
    await new Promise<void>((resolve) => {
      req.on('data', (chunk) => buffers.push(chunk))
      req.on('end', () => resolve())
    })
    const json = buffers.length ? JSON.parse(Buffer.concat(buffers).toString('utf8')) : {}

    const { planName, email } = json || {}
    console.log('Received request:', { planName, email })
    
    const priceId = getPriceIdForPlan(planName)
    console.log('Resolved priceId:', priceId, 'for plan:', planName)
    
    if (!priceId) {
      console.error('No price ID found for plan:', planName)
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: `Invalid plan: ${planName}. No price ID configured.` }))
      return
    }

    const host = req.headers['x-forwarded-host'] || req.headers['host']
    const proto = (req.headers['x-forwarded-proto'] as string) || 'https'
    const origin = `${proto}://${host}`

    console.log('Creating Stripe session with priceId:', priceId)
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
      // Optionally enable a trial; can be configured on price instead
      subscription_data: {
        trial_settings: { end_behavior: { missing_payment_method: 'cancel' } },
        trial_period_days: 14,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ url: session.url }))
  } catch (err: any) {
    console.error('Error in create-checkout-session:', err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: err.message || 'Internal Server Error', details: err.toString() }))
  }
}
