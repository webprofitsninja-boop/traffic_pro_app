import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useTeamCollaboration = (teamId?: string) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTeams = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('teams').select('*').eq('owner_id', user.id);
    setTeams(data || []);
    setLoading(false);
  };

  const fetchMembers = async () => {
    if (!teamId) return;
    const { data } = await supabase.from('team_members').select('*').eq('team_id', teamId);
    setMembers(data || []);
  };

  const createTeam = async (name: string) => {
    if (!user) return;
    const { data, error } = await supabase.from('teams').insert({ name, owner_id: user.id }).select().single();
    if (!error) await fetchTeams();
    return { data, error };
  };

  const inviteMember = async (email: string, role: string) => {
    if (!teamId || !user) return;
    const { data, error } = await supabase.from('team_members').insert({
      team_id: teamId,
      user_id: user.id,
      email,
      role
    }).select().single();
    if (!error) await fetchMembers();
    return { data, error };
  };

  const logActivity = async (action: string, entityType: string, entityId: string, details?: any) => {
    if (!user) return;
    await supabase.from('activity_logs').insert({
      team_id: teamId,
      user_id: user.id,
      user_email: user.email,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details
    });
  };

  useEffect(() => {
    fetchTeams();
  }, [user]);

  useEffect(() => {
    if (teamId) fetchMembers();
  }, [teamId]);

  return { teams, members, loading, createTeam, inviteMember, logActivity, fetchTeams, fetchMembers };
};
