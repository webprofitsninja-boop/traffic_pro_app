import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, User, FileEdit, Trash2, Plus } from 'lucide-react';

const getIcon = (action: string) => {
  if (action.includes('create')) return <Plus className="w-4 h-4 text-green-500" />;
  if (action.includes('update')) return <FileEdit className="w-4 h-4 text-blue-500" />;
  if (action.includes('delete')) return <Trash2 className="w-4 h-4 text-red-500" />;
  return <Activity className="w-4 h-4 text-gray-500" />;
};

export const ActivityLog = ({ teamId }: { teamId?: string }) => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchActivities();
  }, [teamId]);

  const fetchActivities = async () => {
    let query = supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50);
    if (teamId) query = query.eq('team_id', teamId);
    const { data } = await query;
    setActivities(data || []);
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Activity Log
      </h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b">
              {getIcon(activity.action)}
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium">{activity.user_email}</span>
                  <span className="text-gray-600 ml-1">{activity.action}</span>
                  <span className="text-gray-600 ml-1">{activity.entity_type}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{new Date(activity.created_at).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
