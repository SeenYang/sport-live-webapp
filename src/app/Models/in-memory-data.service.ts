import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Hero} from './hero';
import {GAMES, PLAYERS, TEAMS} from './mock-data';
import {v4 as guid} from 'uuid';
import {GameEvent} from './gameEvent';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const games = GAMES;
    const players = PLAYERS;
    const teams = TEAMS;
    const events: GameEvent[] = [];
    return { games, players, teams, events};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }


}
