import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from './message.service';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Player} from '../Models/player';

@Injectable({providedIn: 'root'})
export class PlayerService {
  private playerUrl = 'api/players';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) {
  }

  /** GET heroes from the server */
  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.playerUrl)
      .pipe(
        tap(_ => this.log('Fetch players')),
        catchError(this.handleError<Player[]>('getPlayers', []))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: string): Observable<Player> {
    const url = `${this.playerUrl}/GetPlayerById/${id}`;
    return this.http.get<Player>(url).pipe(
      tap(_ => this.log(`fetched player id=${id}`)),
      catchError(this.handleError<Player>(`getHero id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  getPlayersByTeamId(teamId: string): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.playerUrl}/GetPlayersByTeamId/${teamId}`).pipe(
      tap(x => x.length ?
        this.log(`found players matching "${teamId}"`) :
        this.log(`no player for team: "${teamId}"`)),
      catchError(this.handleError<Player[]>('searchHeroes', []))
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

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.messageService.add(`HeroService: ${message}`);
  }
}
