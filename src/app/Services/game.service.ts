import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {Game} from '../Models/game';
import {catchError, map, tap} from 'rxjs/operators';
import {Team} from '../Models/sportTeams';
import {ENV, Environment} from '../../environments/environment.provider';
import {environment as testEnv} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class GameService {
  gameUrl = `${testEnv.apiPath}/api/games`;
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}, )
  };

  constructor(
    @Inject(ENV) private env: Environment,
    private http: HttpClient) {
    if (this.env.production) {
      this.gameUrl = env.apiPath;
    }
  }

  getGame(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.gameUrl}`)
      .pipe(
        tap(gs => gs),
        catchError(error => this.handleError(error))
      );
  }

  getGameById(gameId: string) {
    const url = `${this.gameUrl}/GetGameById/${gameId}`;
    return this.http.get<Game>(url).pipe(
      tap(g => g),
      catchError(error => this.handleError(error))
    );
  }

  getGameByDate(date: string): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.gameUrl}/GetGamesByDate/${date}`)
      .pipe(
        tap(gs => gs),
        catchError(error => this.handleError(error))
      );
  }

  getTeamsByGameId(gameId: string): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.gameUrl}/getTeamsByGameId/${gameId}`)
      .pipe(
        tap(g => g),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError(error: any): Observable<any> {
    return throwError(error);
  }
}
