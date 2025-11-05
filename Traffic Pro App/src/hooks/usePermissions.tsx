import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface CampaignPermission {
  id: string;
  campaignId: string;
  userId: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManagePermissions: boolean;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
}

export interface CustomRole {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
}

export interface PermissionAuditLog {
  id: string;
  teamId: string;
  campaignId?: string;
  actionType: string;
  performedBy: string;
  affectedUser?: string;
  previousPermissions?: any;
  newPermissions?: any;
  roleName?: string;
  reason?: string;
  createdAt: string;
}

export const usePermissions = (teamId?: string) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<CampaignPermission[]>([]);
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [auditLogs, setAuditLogs] = useState<PermissionAuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPermissions = async (campaignId?: string) => {
    if (!user || !teamId) return;
    setLoading(true);
    try {
      let query = supabase.from('campaign_permissions').select('*').eq('team_id', teamId);
      if (campaignId) query = query.eq('campaign_id', campaignId);
      const { data } = await query;
      setPermissions(data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomRoles = async () => {
    if (!teamId) return;
    try {
      const { data } = await supabase.from('custom_roles').select('*').eq('team_id', teamId);
      setCustomRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchAuditLogs = async (limit = 50) => {
    if (!teamId) return;
    try {
      const { data } = await supabase.from('permission_audit_logs')
        .select('*').eq('team_id', teamId).order('created_at', { ascending: false }).limit(limit);
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  const grantPermission = async (campaignId: string, userId: string, perms: Partial<CampaignPermission>, reason?: string) => {
    const { data } = await supabase.functions.invoke('manage-campaign-permissions', {
      body: { action: 'grant', campaignId, userId, permissions: perms, teamId, reason }
    });
    await fetchPermissions();
    await fetchAuditLogs();
    return data;
  };

  const revokePermission = async (campaignId: string, userId: string, reason?: string) => {
    const { data } = await supabase.functions.invoke('manage-campaign-permissions', {
      body: { action: 'revoke', campaignId, userId, teamId, reason }
    });
    await fetchPermissions();
    await fetchAuditLogs();
    return data;
  };

  const checkPermission = (campaignId: string, permission: keyof CampaignPermission): boolean => {
    const perm = permissions.find(p => p.campaignId === campaignId && p.userId === user?.id);
    return perm ? perm[permission] as boolean : false;
  };

  useEffect(() => {
    if (teamId) {
      fetchPermissions();
      fetchCustomRoles();
      fetchAuditLogs();
    }
  }, [teamId]);

  return {
    permissions,
    customRoles,
    auditLogs,
    loading,
    fetchPermissions,
    fetchCustomRoles,
    fetchAuditLogs,
    grantPermission,
    revokePermission,
    checkPermission
  };
};
