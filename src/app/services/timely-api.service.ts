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
  private headers = new HttpHeaders().set('X-Api-Key', environment.apiKey);

  constructor(private http: HttpClient) { }

  public fetchEvents(): Observable<TimelyEvent[]> {
    return this.getCalendarInfo().pipe(
      switchMap(info => this.getEvents(info.data.id)),
      map(response => response.data.items),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
    } else {
      errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error('Something bad happened; please try again later.'));
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