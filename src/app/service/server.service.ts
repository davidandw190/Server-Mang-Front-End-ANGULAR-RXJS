import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';
@Injectable({ providedIn: 'root' })
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  servers$: Observable<CustomResponse> = this.http
    .get<CustomResponse>(`${this.apiUrl}/server/list`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  save$ = (server: Server): Observable<CustomResponse> =>
    this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server).pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  ping$ = (ipAddress: string): Observable<CustomResponse> =>
    this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`).pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  filter$ = (status: Status, response: CustomResponse): Observable<CustomResponse> => {
    console.log(response);

    // @ts-ignore
    const filteredServers = response.data.servers.filter((server) => server.status === status);
    const filteredServersLength = filteredServers.length;
    const statusMessage = status === Status.ALL
      ? `Servers filtered by ${status} status`
      : filteredServersLength > 0
        ? `Servers filtered by ${status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'} status`
        : `No servers of ${status} found`;

    const filteredResponse = {
      ...response,
      message: statusMessage,
      data: {
        servers: filteredServers
      }
    };

    return of(filteredResponse).pipe(
      tap(console.log),
      catchError(this.handleError)
    );
  };

  delete$ = (serverId: number): Observable<CustomResponse> =>
    this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`).pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    const errorMessage = `An error occurred - Error code: ${error.status}`;
    return throwError(errorMessage);
  }


}
