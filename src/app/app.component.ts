import {Component, OnInit} from '@angular/core';
import {ServerService} from "./service/server.service";
import {CustomResponse} from "./interface/custom-response";
import {AppState} from "./interface/app-state";
import {map, Observable, of, pipe, startWith} from "rxjs";
import {DataState} from "./enum/data-state.enum";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Server-Management-Application';

  appState$: Observable<AppState<CustomResponse>> =
    of({ dataState: DataState.LOADING_STATE });

  constructor(private serverService: ServerService) {}

  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
      .pipe(
        map((response: CustomResponse) => {
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error })
        })
      );
  }


  protected readonly DataState = DataState;

  filterServers($event: any) {
    
  }
}
