import { useState } from 'react';
import { useTeamCollaboration } from '@/hooks/useTeamCollaboration';
import { TeamSelector } from '@/components/collaboration/TeamSelector';
import { ActivityLog } from '@/components/collaboration/ActivityLog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, UserPlus, Shield, Eye, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const TeamManagement = () => {
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const { teams, members, createTeam, inviteMember, fetchMembers } = useTeamCollaboration(selectedTeam);

  const handleCreateTeam = async () => {
    if (!newTeamName) return;
    const { error } = await createTeam(newTeamName);
    if (!error) {
      toast.success('Team created');
      setNewTeamName('');
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !selectedTeam) return;
    const { error } = await inviteMember(inviteEmail, inviteRole);
    if (!error) {
      toast.success('Invitation sent');
      setInviteEmail('');
    }
  };

  const getRoleIcon = (role: string) => {
    if (role === 'admin') return <Shield className="w-4 h-4 text-red-500" />;
    if (role === 'editor') return <Edit className="w-4 h-4 text-blue-500" />;
    return <Eye className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8" />
            Team Management
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Team</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Team name" />
                <Button onClick={handleCreateTeam} className="w-full">Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <TeamSelector teams={teams} selectedTeam={selectedTeam} onTeamChange={(id) => { setSelectedTeam(id); fetchMembers(); }} />
        </div>

        {selectedTeam && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Team Members</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm"><UserPlus className="w-4 h-4 mr-2" />Invite</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Email" type="email" />
                        <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleInvite} className="w-full">Send Invitation</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(member.role)}
                        <div>
                          <div className="font-medium text-white">{member.email}</div>
                          <Badge variant="outline" className="mt-1">{member.role}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <div>
              <ActivityLog teamId={selectedTeam} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
