import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { TimelyEvent } from '../models/event.model';
import { CalendarInfo } from '../models/calendar-info.model';
import { ApiListResponse, ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TimelyApiService {
  private headers = new HttpHeaders({
    'X-Api-Key': environment.apiKey
  });

  constructor(private http: HttpClient) { }

  //metodo de conexão pública
  public fetchEvents(): Observable<TimelyEvent[]> {
    return this.getCalendarInfo().pipe(
      switchMap(info => this.getEvents(info.data.id)),
      map(response => response.data.items),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);

    // CORRIJA AQUI para retornar a mensagem em português
    return throwError(() => new Error('Unable to load events. Please try again later.'));
  }

  private getCalendarInfo(): Observable<ApiResponse<CalendarInfo>> {
    const params = new HttpParams().set('url', environment.calendarUrl);
    const url = `${environment.apiUrl}info`;
    return this.http.get<ApiResponse<CalendarInfo>>(url, { headers: this.headers, params });
  }

  private getEvents(calendarId: string): Observable<ApiListResponse<TimelyEvent>> {
    const url = `${environment.apiUrl}${calendarId}/events`;
    return this.http.get<ApiListResponse<TimelyEvent>>(url, { headers: this.headers });
  }
}