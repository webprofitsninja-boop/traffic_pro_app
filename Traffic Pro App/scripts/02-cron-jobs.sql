-- Cron Job Setup for Automated Reports
-- Replace YOUR_SUPABASE_URL with your actual Supabase project URL
-- Run this in Supabase SQL Editor after deploying edge functions

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Daily report sender (runs at 9 AM UTC daily)
SELECT cron.schedule(
  'daily-report-check',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/scheduled-report-sender',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- View scheduled jobs
SELECT * FROM cron.job;

-- To unschedule (if needed):
-- SELECT cron.unschedule('daily-report-check');
