import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ABTestCard } from '@/components/abtest/ABTestCard';
import { CreateABTestModal } from '@/components/abtest/CreateABTestModal';
import { ABTestResults } from '@/components/abtest/ABTestResults';
import { useABTesting } from '@/hooks/useABTesting';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function ABTestingDashboard() {
  const { tests, loading, refetch } = useABTesting();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const { data } = await supabase.from('campaigns').select('*');
    if (data) setCampaigns(data);
  };

  const handleToggleStatus = async (testId: string, newStatus: string) => {
    try {
      await supabase
        .from('ab_tests')
        .update({ status: newStatus })
        .eq('id', testId);
      
      toast.success(`Test ${newStatus === 'running' ? 'started' : 'paused'}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">A/B Testing</h1>
          <p className="text-gray-600 mt-2">
            Create experiments, split traffic, and optimize your campaigns
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Test
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map(test => (
          <ABTestCard
            key={test.id}
            test={test}
            onViewDetails={setSelectedTest}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No A/B tests yet</p>
          <Button onClick={() => setCreateModalOpen(true)}>
            Create Your First Test
          </Button>
        </div>
      )}

      <CreateABTestModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={refetch}
        campaigns={campaigns}
      />

      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTest?.name} - Results</DialogTitle>
          </DialogHeader>
          {selectedTest && <ABTestResults testId={selectedTest.id} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
