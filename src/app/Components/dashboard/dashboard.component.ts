import {Component, OnInit} from '@angular/core';
import {Hero} from '../../Models/hero';
import {Game} from '../../Models/game';
import {GameService} from '../../Services/game.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  games: Game[] = [];

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.getTodayGame();
  }

  getTodayGame(): void {
    const today = new Date();
    const dateStr = `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`;
    this.gameService.getGameByDate(dateStr)
    // this.gameService.getGame()
      .subscribe(g => this.games = g);
  }
}
