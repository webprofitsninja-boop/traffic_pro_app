-- Stripe Webhook Handler Setup
-- This creates a function to handle Stripe webhook events

CREATE OR REPLACE FUNCTION handle_stripe_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Update subscription status when Stripe sends webhook
  IF NEW.stripe_subscription_id IS NOT NULL THEN
    UPDATE subscriptions
    SET 
      status = NEW.status,
      current_period_end = NEW.current_period_end,
      plan_type = NEW.plan_type
    WHERE stripe_subscription_id = NEW.stripe_subscription_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for subscription updates
DROP TRIGGER IF EXISTS on_subscription_change ON subscriptions;
CREATE TRIGGER on_subscription_change
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_stripe_webhook();
