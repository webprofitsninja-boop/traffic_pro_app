import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

interface TeamSelectorProps {
  teams: any[];
  selectedTeam?: string;
  onTeamChange: (teamId: string) => void;
}

export const TeamSelector = ({ teams, selectedTeam, onTeamChange }: TeamSelectorProps) => {
  return (
    <Select value={selectedTeam} onValueChange={onTeamChange}>
      <SelectTrigger className="w-[200px]">
        <Users className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Select team" />
      </SelectTrigger>
      <SelectContent>
        {teams.map((team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
