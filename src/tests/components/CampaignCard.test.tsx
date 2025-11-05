import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CampaignCard from '@/components/CampaignCard';

const mockCampaign = {
  id: '1',
  name: 'Test Campaign',
  platform: 'Google Ads',
  status: 'active' as const,
  clicks: 1250,
  impressions: 45000,
  conversions: 85,
  spend: 450,
};

describe('CampaignCard', () => {
  it('renders campaign information correctly', () => {
    render(
      <BrowserRouter>
        <CampaignCard campaign={mockCampaign} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    expect(screen.getByText('Google Ads')).toBeInTheDocument();
    expect(screen.getByText('1,250')).toBeInTheDocument();
    expect(screen.getByText('45,000')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(
      <BrowserRouter>
        <CampaignCard campaign={mockCampaign} onEdit={onEdit} />
      </BrowserRouter>
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledWith(mockCampaign);
  });

  it('displays correct status badge', () => {
    render(
      <BrowserRouter>
        <CampaignCard campaign={mockCampaign} />
      </BrowserRouter>
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
