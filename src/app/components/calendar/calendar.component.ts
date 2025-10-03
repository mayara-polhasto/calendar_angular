import { Component, OnInit } from '@angular/core';
import { TimelyApiService } from '../../services/timely-api.service';
import { TimelyEvent } from '../../models/event.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  public events: TimelyEvent[] = [];
  public isLoading: boolean = true;
  public error: string | null = null;

  constructor(private apiService: TimelyApiService) {}

  ngOnInit(): void {
    console.log("Iniciando busca de dados da API...");
    this.isLoading = true;
    this.error = null;
    
    this.apiService.fetchEvents().subscribe({
    next: (eventsArray: TimelyEvent[]) => {
    this.events = eventsArray;
    this.isLoading = false;
    console.log("Eventos recebidos com sucesso!", this.events);
},
      error: (err: HttpErrorResponse) => {
      this.isLoading = false;
      this.error = err.message; 
      console.error("Ocorreu um erro no componente:", err);
      }
    });
  }
}