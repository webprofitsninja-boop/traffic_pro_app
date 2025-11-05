import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/usePermissions';

interface CustomRoleManagerProps {
  teamId: string;
}

export const CustomRoleManager = ({ teamId }: CustomRoleManagerProps) => {
  const { customRoles, fetchCustomRoles } = usePermissions(teamId);
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState({
    viewCampaigns: true,
    createCampaigns: false,
    editCampaigns: false,
    deleteCampaigns: false,
    viewAnalytics: true,
    exportData: false,
    manageTeam: false,
    managePermissions: false,
    viewBilling: false,
    manageBilling: false
  });

  const handleCreate = async () => {
    if (!roleName) {
      toast.error('Role name is required');
      return;
    }
    try {
      await supabase.functions.invoke('manage-custom-roles', {
        body: { action: 'create', teamId, roleName, description, permissions }
      });
      toast.success('Role created');
      setOpen(false);
      setRoleName('');
      setDescription('');
      fetchCustomRoles();
    } catch (error) {
      toast.error('Failed to create role');
    }
  };

  const handleDelete = async (roleId: string, name: string) => {
    try {
      await supabase.functions.invoke('manage-custom-roles', {
        body: { action: 'delete', teamId, roleId, roleName: name }
      });
      toast.success('Role deleted');
      fetchCustomRoles();
    } catch (error) {
      toast.error('Failed to delete role');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Custom Roles
            </CardTitle>
            <CardDescription>Create role templates with specific permission sets</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />New Role</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Custom Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Role Name</Label>
                  <Input value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g., Campaign Manager" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What can this role do?" />
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <Switch checked={value} onCheckedChange={(checked) => setPermissions({ ...permissions, [key]: checked })} />
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={handleCreate} className="w-full">Create Role</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {customRoles.map(role => (
          <div key={role.id} className="p-4 border rounded-lg space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {role.name}
                  {role.isDefault && <Badge>Default</Badge>}
                </h3>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(role.id, role.name)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(role.permissions).filter(([_, v]) => v).map(([key]) => (
                <Badge key={key} variant="secondary" className="text-xs">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
