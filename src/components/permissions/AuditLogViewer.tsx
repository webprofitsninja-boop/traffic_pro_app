import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePermissions } from '@/hooks/usePermissions';
import { FileText, Shield, UserPlus, UserMinus, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogViewerProps {
  teamId: string;
}

export const AuditLogViewer = ({ teamId }: AuditLogViewerProps) => {
  const { auditLogs, fetchAuditLogs } = usePermissions(teamId);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAuditLogs();
  }, [teamId]);

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'grant': return <UserPlus className="w-4 h-4" />;
      case 'revoke': return <UserMinus className="w-4 h-4" />;
      case 'update': return <Edit2 className="w-4 h-4" />;
      case 'role_created': return <Shield className="w-4 h-4" />;
      case 'role_deleted': return <Trash2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'grant': return 'bg-green-500';
      case 'revoke': return 'bg-red-500';
      case 'update': return 'bg-blue-500';
      case 'role_created': return 'bg-purple-500';
      case 'role_deleted': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filter !== 'all' && log.actionType !== filter) return false;
    if (search && !log.actionType.toLowerCase().includes(search.toLowerCase()) && 
        !log.affectedUser?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Permission Audit Log
        </CardTitle>
        <CardDescription>Track all permission changes and role modifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="grant">Granted</SelectItem>
              <SelectItem value="revoke">Revoked</SelectItem>
              <SelectItem value="update">Updated</SelectItem>
              <SelectItem value="role_created">Role Created</SelectItem>
              <SelectItem value="role_deleted">Role Deleted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {filteredLogs.map(log => (
            <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className={`p-2 rounded-full ${getActionColor(log.actionType)} text-white`}>
                {getActionIcon(log.actionType)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{log.actionType}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(log.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                <p className="text-sm">
                  <span className="font-medium">{log.performedBy}</span>
                  {log.affectedUser && <> affected <span className="font-medium">{log.affectedUser}</span></>}
                  {log.roleName && <> role: <span className="font-medium">{log.roleName}</span></>}
                </p>
                {log.reason && <p className="text-xs text-muted-foreground italic">{log.reason}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
