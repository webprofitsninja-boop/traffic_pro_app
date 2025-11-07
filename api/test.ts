import type { IncomingMessage, ServerResponse } from 'http'

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse & { statusCode: number; setHeader: (k: string, v: string) => void; end: (b?: any) => void }
) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ 
    message: 'API works!',
    env: {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasBasicPrice: !!process.env.VITE_STRIPE_PRICE_BASIC,
      hasStripeBasicPrice: !!process.env.STRIPE_PRICE_BASIC
    }
  }))
}
