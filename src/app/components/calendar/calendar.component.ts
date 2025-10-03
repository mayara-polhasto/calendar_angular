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

  constructor(private apiService: TimelyApiService) { }

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

  public updateImageOnError(event: Event): void {
    // Verificamos se o 'target' do evento existe
    const element = event.target as HTMLImageElement;
    if (element) {
      element.src = 'https://placehold.co/400x200/f5fff5/333?text=Imagem+Indisponível';
    }
  }
}