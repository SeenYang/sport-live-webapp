import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientInMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from './Models/in-memory-data.service';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './Components/dashboard/dashboard.component';
import {GameDetailComponent} from './Components/game-detail/game-detail.component';
import {MessagesComponent} from './Components/messages/messages.component';
import {ENV, getEnv} from '../environments/environment.provider';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService, {dataEncapsulation: false}
    // )
  ],
  providers: [
    {provide: ENV, useFactory: getEnv}
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    GameDetailComponent,
    MessagesComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
