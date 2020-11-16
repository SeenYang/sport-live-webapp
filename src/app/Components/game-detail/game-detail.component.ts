import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {GameService} from '../../Services/game.service';
import {Game} from '../../Models/game';
import {Team} from '../../Models/sportTeams';
import {Player} from '../../Models/player';
import {TeamEvents} from '../../Models/teamEvents';
import {PlayerEvents} from '../../Models/playerEvents';
import {GameEventService} from '../../Services/gameEvent.service';
import {GameEvent} from '../../Models/gameEvent';
import {v4 as guid} from 'uuid';
import {MessageService} from '../../Services/message.service';
import {CourtPosition} from '../../Models/Position';
import {GameEvents} from '../../Models/gameEvents';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private gameEventService: GameEventService,
    private messageService: MessageService,
    private location: Location
  ) {
  }

  teamEvents = TeamEvents;
  playerEvents = PlayerEvents;
  gameEvents = GameEvents;

  gameId: string;
  game: Game;
  events: GameEvent[];
  selectedPlayer: Player;
  selectedTeam: Team;
  selectedPosition: CourtPosition;
  selectedTeamEvent: string;
  selectedPlayerEvent: string;
  selectedGameEvent: string;
  courtX = 10;
  courtY = 5;
  court: CourtPosition[][] = [];

  private static genGuid(): string {
    return guid();
  }

  reset() {
    this.selectedTeamEvent = null;
    this.selectedPlayerEvent = null;
    this.selectedPlayer = null;
    this.selectedTeam = null;
    this.selectedPosition = null;
    this.selectedGameEvent = null;
  }

  private initiateCourt() {
    this.court = new Array(this.courtY).fill([] as CourtPosition[]).map(() => new Array(this.courtX).fill({
      y: 0,
      x: 0
    } as CourtPosition));

    for (let y = 0; y < this.courtY; y++) {
      for (let x = 0; x < this.courtX; x++) {
        this.court[y][x] = {y: y + 1, x: x + 1} as CourtPosition;
      }
    }
  }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.getGame(this.gameId);
    this.getEvents(this.gameId);
    this.reset();
    this.initiateCourt();
  }

  getGame(id: string): void {
    this.gameService.getGameById(id)
      .subscribe(game => this.game = game);
  }

  getEvents(gameId: string): void {
    this.gameEventService.getEventsByGameId(gameId)
      .subscribe((events) => {
        this.events = events;
        this.messageService.messages = events.map((e) => e.message);
      });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    const msgPrefix = `${new Date().toLocaleString('en-AU', {timeZone: 'UTC'})} -> `;
    let msg = '';
    if (this.selectedGameEvent) {
      // Select game event.
      msg += `${this.selectedGameEvent}.`;
      this.reset();
    } else {
      if (this.selectedTeam && this.selectedTeamEvent) {
        msg += `${this.selectedTeam.name}  -> ${this.selectedTeamEvent}`;
      } else {
        if (this.selectedPlayer && this.selectedPosition && this.selectedPlayerEvent) {
          msg += `${this.selectedPlayer.firstName} ${this.selectedPlayer.lastName} ->
          Position: (y: ${this.selectedPosition.y} x: ${this.selectedPosition.x}) ->
          ${this.selectedPlayerEvent}. `;
        } else {
          this.messageService.add('Please select team with team event, or player with player event, or game event.');
          return;
        }
      }
    }

    let event: GameEvent;
    event = {
      id: GameDetailComponent.genGuid(),
      teamEvent: this.teamEvents.get(this.selectedTeamEvent),
      playerEvent: this.playerEvents.get(this.selectedPlayerEvent),
      gameEvent: this.gameEvents.get(this.selectedGameEvent),
      timeStamp: new Date(),
      gameId: this.gameId,
      teamId: this.selectedTeam?.id,
      playerId: this.selectedPlayer?.id,
      message: msgPrefix + msg
    };

    this.gameEventService.addEvent(event).subscribe((newEvent) => {
      console.log(newEvent);
      this.messageService.add(msg);
      this.reset();
    });
  }

  selectPlayer(player: Player) {
    if (this.selectedPlayer === player) {
      this.selectedPlayer = null;
    } else {
      this.selectedPlayer = player;
    }

    this.selectedGameEvent = null;
    console.log(this.selectedPlayer);
  }

  selectTeam(team: Team) {
    if (this.selectedTeam === team) {
      this.selectedTeam = null;
    } else {
      this.selectedGameEvent = null;
      this.selectedTeam = team;
    }
    this.selectedPlayer = null;
    console.log(this.selectedTeam);
  }

  selectTeamEvent(et: string) {
    this.selectedPlayerEvent = null;
    this.selectedPosition = null;
    this.selectedGameEvent = null;
    this.selectedTeamEvent = et;

    console.log(this.selectedTeamEvent);
  }

  selectPlayerEvent(est: string) {
    this.selectedPlayerEvent = est;
    this.selectedGameEvent = null;
    console.log(this.selectedPlayerEvent);
  }

  selectPosition(p: CourtPosition) {
    if (this.selectedPosition === p) {
      this.selectedPosition = null;
    } else {
      this.selectedPosition = p;
      this.selectedGameEvent = null;
      this.selectedTeamEvent = null;
    }

    this.selectedGameEvent = null;
    console.log(this.selectedPosition);
  }

  selectGameEvent(ge: string) {
    this.reset();
    this.selectedGameEvent = ge;
    console.log(this.selectedGameEvent);
  }
}
