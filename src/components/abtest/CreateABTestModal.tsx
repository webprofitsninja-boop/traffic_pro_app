import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CreateABTestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  campaigns: any[];
}

export function CreateABTestModal({ open, onClose, onSuccess, campaigns }: CreateABTestModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    campaign_id: '',
    confidence_level: 95,
    variations: [
      { name: 'Control', is_control: true, traffic_percentage: 50 },
      { name: 'Variation A', is_control: false, traffic_percentage: 50 }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data: test, error } = await supabase
        .from('ab_tests')
        .insert({
          user_id: user.user?.id,
          name: formData.name,
          description: formData.description,
          campaign_id: formData.campaign_id,
          confidence_level: formData.confidence_level,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      // Create variations
      const variationsData = formData.variations.map(v => ({
        ab_test_id: test.id,
        name: v.name,
        is_control: v.is_control,
        traffic_percentage: v.traffic_percentage
      }));

      await supabase.from('ab_test_variations').insert(variationsData);

      toast.success('A/B test created successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create A/B Test</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Test Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div>
            <Label>Campaign</Label>
            <Select value={formData.campaign_id} onValueChange={(v) => setFormData({...formData, campaign_id: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Create Test</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
