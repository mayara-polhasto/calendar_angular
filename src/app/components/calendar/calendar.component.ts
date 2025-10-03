import { Component, OnInit } from '@angular/core';
import { TimelyApiService } from '../../services/timely-api.service';
import { TimelyEvent } from '../../models/event.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [DatePipe]
})
export class CalendarComponent implements OnInit {
  public events: TimelyEvent[] = [];
  public isLoading: boolean = true;
  public error: string | null = null;
  public currentDate = new Date();

  constructor(private apiService: TimelyApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    const today = new Date();
    const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd') || undefined;
    this.isLoading = true;
    this.error = null;

    this.apiService.fetchEvents(formattedDate).subscribe({
      next: (eventsArray: TimelyEvent[]) => {
        this.events = eventsArray;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.error = err.message;
        console.error("Ocorreu um erro no componente:", err);
      }
    });
  }

  public updateImageOnError(event: Event): void {
  const element = event.target as HTMLImageElement;
  if (element) {
    // Em vez de trocar a URL, nós simplesmente escondemos o elemento <img>
    element.style.display = 'none';
  }
}
}