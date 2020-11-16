import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError, mapTo, tap} from 'rxjs/operators';
import {GameEvent} from '../Models/gameEvent';
import {ENV, Environment} from '../../environments/environment.provider';
import {environment as testEnv} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class GameEventService {
  private eventUrl = `${testEnv.apiPath}/api/events`;
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    @Inject(ENV) private env: Environment,
    private http: HttpClient) {
    if (this.env.production) {
      this.eventUrl = env.apiPath;
    }
  }

  getEventsByGameId(gameId: string): Observable<GameEvent[]> {
    return this.http.get<GameEvent[]>(`${this.eventUrl}/?gameId=${gameId}`)
      .pipe(
        tap((events) => {
          console.log(events);
          console.log(`fetched events for game ${gameId}`);
        }),
        catchError(this.handleError<GameEvent[]>('get events by game Id', []))
      );
  }

  /** POST: add a new hero to the server */
  addEvent(event: GameEvent): Observable<boolean> {
    // return this.http.post<GameEvent>(this.eventUrl, event).pipe(
    //   tap((newEvent: GameEvent) => console.log(`added event w/ id=${newEvent.id}`)),
    //   catchError(this.handleError<GameEvent>('add event'))
    // );

    return this.http.post<GameEvent>(this.eventUrl, event).pipe(
      tap((newEvent: GameEvent) => console.log(`added event w/ id=${newEvent.id}`)),
      mapTo(true),
      catchError((error) => {
        this.handleError(error);
        return of(false);
      })
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
