# Automated Email Reporting - Cron Job Setup

## Overview
The automated email reporting system sends weekly/monthly analytics summaries to users based on their configured preferences.

## Components

### 1. Database Table: `report_configurations`
Stores user preferences for automated reports:
- `user_id`: User identifier
- `frequency`: 'weekly', 'monthly', or 'disabled'
- `recipients`: Array of email addresses
- `include_charts`: Boolean for chart inclusion
- `include_insights`: Boolean for insights inclusion
- `next_send_date`: Timestamp for next scheduled report

### 2. Edge Functions

#### `send-analytics-report`
Sends individual email reports via SendGrid with formatted HTML and metrics.

#### `scheduled-report-sender`
Cron job that runs daily to:
- Query for reports where `next_send_date` is due
- Fetch analytics data for each user
- Send reports to configured recipients
- Update `next_send_date` for next cycle

## Setting Up the Cron Job

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions** → **scheduled-report-sender**
3. Click **Settings** or **Cron**
4. Set schedule: `0 9 * * *` (runs daily at 9 AM UTC)
5. Save the configuration

### Option 2: Using pg_cron (Database-level)
```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the function to run daily at 9 AM UTC
SELECT cron.schedule(
  'send-scheduled-reports',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'YOUR_SUPABASE_URL/functions/v1/scheduled-report-sender',
    headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);
```

### Option 3: External Cron Service
Use services like:
- **Cron-job.org**
- **EasyCron**
- **GitHub Actions**

Configure to make daily POST request to:
```
POST https://YOUR_PROJECT.supabase.co/functions/v1/scheduled-report-sender
Authorization: Bearer YOUR_ANON_KEY
```

## Testing

### Manual Trigger
```bash
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/scheduled-report-sender \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Test Report from UI
Users can send test reports from Profile → Email Reports → "Send Test Report" button.

## Monitoring
Check edge function logs in Supabase Dashboard to monitor:
- Number of reports processed
- Success/failure status
- Error messages

## Troubleshooting

### Reports not sending
1. Verify `SENDGRID_API_KEY` is configured in Supabase secrets
2. Check SendGrid sender email is verified
3. Review edge function logs for errors
4. Ensure `next_send_date` is set correctly in database

### Wrong send times
- Cron runs in UTC timezone
- Adjust cron schedule as needed
- Users see next send date in their local timezone in UI
