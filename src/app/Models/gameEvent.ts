
import {Time} from '@angular/common';

export interface GameEvent {
  id: string;
  teamEvent: string;
  playerEvent: string;
  gameEvent: string;
  timeStamp: Date;
  gameId: string;
  teamId?: string;
  playerId?: string;
  message: string;
}
