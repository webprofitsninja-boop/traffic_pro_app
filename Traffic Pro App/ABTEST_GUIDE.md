# A/B Testing Guide

## Overview
TrafficPro now includes comprehensive A/B testing functionality to help you optimize your campaigns through data-driven experimentation.

## Features

### 1. Create A/B Tests
- Create tests with multiple variations (Control + Variations)
- Link tests to specific campaigns
- Configure traffic split percentages
- Set confidence level thresholds (default: 95%)

### 2. Track Performance
- **Visitors**: Track unique visitors to each variation
- **Conversions**: Monitor conversion events
- **Conversion Rate**: Automatically calculated percentage
- **Revenue**: Track monetary value from conversions

### 3. Statistical Significance
- Automatic Z-score calculation using two-proportion test
- Confidence level determination (80%, 90%, 95%, 99%)
- Lift percentage showing improvement over control
- Winner detection when significance threshold is met

### 4. Test Management
- Start/pause tests at any time
- View real-time results
- Compare variations side-by-side
- Automated winner detection

## How to Use

### Creating a Test
1. Navigate to the A/B Testing dashboard
2. Click "Create Test"
3. Fill in test details:
   - Name and description
   - Select campaign
   - Set confidence level
4. Variations are created automatically (Control + Variation A)

### Tracking Events
Use the tracking API in your campaigns:

```javascript
import { useABTesting } from '@/hooks/useABTesting';

const { trackEvent } = useABTesting();

// Track a visitor
await trackEvent(testId, variationId, 'visitor');

// Track a conversion with value
await trackEvent(testId, variationId, 'conversion', 49.99);
```

### Viewing Results
1. Go to A/B Testing dashboard
2. Click "View Results" on any test
3. See real-time metrics for each variation:
   - Visitor count
   - Conversion count
   - Conversion rate with progress bar
   - Total revenue
   - Statistical significance badge
   - Lift percentage vs control

### Understanding Statistical Significance
- **Gray badge**: Not statistically significant yet
- **Green badge**: Statistically significant (95%+ confidence)
- **Trophy icon**: Winning variation detected
- **Lift percentage**: Shows improvement (+) or decline (-) vs control

## Database Schema

### ab_tests
- Test metadata and configuration
- Status: draft, running, paused, completed
- Confidence level threshold
- Winner variation tracking

### ab_test_variations
- Variation details (name, description)
- Traffic percentage allocation
- Control flag
- Custom configuration JSON

### ab_test_results
- Real-time performance metrics
- Visitor and conversion counts
- Calculated conversion rates
- Revenue tracking
- Statistical significance values

## Edge Functions

### track-ab-test-event
Tracks visitor and conversion events for test variations.

**Endpoint**: `/functions/v1/track-ab-test-event`

**Body**:
```json
{
  "testId": "uuid",
  "variationId": "uuid",
  "eventType": "visitor" | "conversion",
  "value": 49.99 // optional, for conversions
}
```

### calculate-ab-significance
Calculates statistical significance using Z-score methodology.

**Endpoint**: `/functions/v1/calculate-ab-significance`

**Body**:
```json
{
  "testId": "uuid"
}
```

**Response**:
```json
{
  "results": [
    {
      "variationId": "uuid",
      "confidence": 95,
      "isSignificant": true,
      "lift": 12.5
    }
  ]
}
```

## Best Practices

1. **Sample Size**: Run tests until you have at least 100 conversions per variation
2. **Test Duration**: Run for at least 1-2 weeks to account for weekly patterns
3. **Single Variable**: Test one change at a time for clear insights
4. **Confidence Level**: Use 95% confidence for most business decisions
5. **Winner Selection**: Wait for statistical significance before declaring a winner

## Integration with Campaigns

A/B tests are linked to campaigns, allowing you to:
- Test different ad creatives
- Compare landing page variations
- Optimize call-to-action buttons
- Test pricing strategies
- Experiment with messaging

## Automated Reporting

Future enhancements will include:
- Scheduled A/B test reports via email
- Automatic winner declaration
- Multi-variate testing support
- Advanced segmentation analysis
