import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomRoleManager } from '@/components/permissions/CustomRoleManager';
import { AuditLogViewer } from '@/components/permissions/AuditLogViewer';
import { useTeamCollaboration } from '@/hooks/useTeamCollaboration';

export const PermissionsSettings: React.FC = () => {
  const navigate = useNavigate();
  const { currentTeam } = useTeamCollaboration();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => navigate('/teams')} variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8" />
              Permission Management
            </h1>
            <p className="text-gray-400">Manage roles, permissions, and view audit logs</p>
          </div>
        </div>

        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="bg-white/10">
            <TabsTrigger value="roles">Custom Roles</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="roles">
            <CustomRoleManager teamId={currentTeam?.id || 'default-team'} />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogViewer teamId={currentTeam?.id || 'default-team'} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
