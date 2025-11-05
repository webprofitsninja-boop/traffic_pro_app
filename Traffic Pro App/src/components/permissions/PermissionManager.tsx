import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { usePermissions } from '@/hooks/usePermissions';
import { supabase } from '@/lib/supabase';
import { Shield, UserPlus, Trash2, Eye, Edit, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface PermissionManagerProps {
  campaignId: string;
  teamId: string;
}

export const PermissionManager = ({ campaignId, teamId }: PermissionManagerProps) => {
  const { permissions, grantPermission, revokePermission, fetchPermissions } = usePermissions(teamId);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [canView, setCanView] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canManagePerms, setCanManagePerms] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchTeamMembers();
    fetchPermissions(campaignId);
  }, [campaignId, teamId]);

  const fetchTeamMembers = async () => {
    const { data } = await supabase.from('team_members').select('*').eq('team_id', teamId);
    setTeamMembers(data || []);
  };

  const handleGrant = async () => {
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }
    try {
      await grantPermission(campaignId, selectedUser, {
        canView, canEdit, canDelete, canManagePermissions: canManagePerms
      }, reason);
      toast.success('Permission granted');
      setSelectedUser('');
      setReason('');
    } catch (error) {
      toast.error('Failed to grant permission');
    }
  };

  const handleRevoke = async (userId: string) => {
    try {
      await revokePermission(campaignId, userId, 'Permission revoked by admin');
      toast.success('Permission revoked');
    } catch (error) {
      toast.error('Failed to revoke permission');
    }
  };

  const campaignPerms = permissions.filter(p => p.campaignId === campaignId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Campaign Permissions
        </CardTitle>
        <CardDescription>Manage who can access and edit this campaign</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Grant Access
          </h3>
          <div className="space-y-3">
            <div>
              <Label>Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a team member" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.user_id} value={member.user_id}>
                      {member.user_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <Label>Can View</Label>
                <Switch checked={canView} onCheckedChange={setCanView} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Can Edit</Label>
                <Switch checked={canEdit} onCheckedChange={setCanEdit} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Can Delete</Label>
                <Switch checked={canDelete} onCheckedChange={setCanDelete} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Manage Perms</Label>
                <Switch checked={canManagePerms} onCheckedChange={setCanManagePerms} />
              </div>
            </div>
            <div>
              <Label>Reason (optional)</Label>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why are you granting this access?" />
            </div>
            <Button onClick={handleGrant} className="w-full">Grant Permission</Button>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold">Current Permissions</h3>
          {campaignPerms.map(perm => (
            <div key={perm.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium">{perm.userId}</div>
                <div className="flex gap-1">
                  {perm.canView && <Badge variant="secondary"><Eye className="w-3 h-3" /></Badge>}
                  {perm.canEdit && <Badge variant="secondary"><Edit className="w-3 h-3" /></Badge>}
                  {perm.canDelete && <Badge variant="destructive"><Trash2 className="w-3 h-3" /></Badge>}
                  {perm.canManagePermissions && <Badge><Lock className="w-3 h-3" /></Badge>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleRevoke(perm.userId)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
