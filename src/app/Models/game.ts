import {Team} from './sportTeams';

export interface Game{
  id: string;
  date: Date;
  teamId: string[];
  teamNames: string[];
  teams: Team[];
}
