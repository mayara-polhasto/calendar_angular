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
  public currentDate = new Date();
  public skeletons = Array(10); // skeleton cards
  public isLoading: boolean = true;
  public error: string | null = null;

  public allEvents: TimelyEvent[] = [];
  public filteredEvents: TimelyEvent[] = [];

  public searchTerm: string = '';
  public sortOrder: 'asc' | 'desc' = 'asc';
  public selectedCategory: string = 'all';
  public categories: string[] = [];

  public selectedDate: Date | null = null;

  public sortOptions = [
    { label: 'Date (Oldest First)', value: 'asc' },
    { label: 'Date (Newest First)', value: 'desc' }
  ];

  public categoryOptions: any[] = [{ label: 'All', value: 'all' }];

  constructor(private apiService: TimelyApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.fetchAndDisplayEvents();
  }

  // Busca todos os eventos da API
  private fetchAndDisplayEvents(): void {
    this.isLoading = true;
    this.error = null;

    this.apiService.fetchEvents().subscribe({
      next: (events: TimelyEvent[]) => {
        this.allEvents = events;
        this.extractCategories();
        this.applyFiltersAndSort();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.error = 'Unable to load events. Please try again later.';
        console.error(err);
      }
    });
  }

  // Extrai categorias únicas para o dropdown
  private extractCategories(): void {
    const allTicketTypes = this.allEvents.map(e => e.ticket_type);
    this.categories = [...new Set(allTicketTypes)];
    const newOptions = this.categories.map(cat => ({ label: cat, value: cat }));
    this.categoryOptions = [{ label: 'All', value: 'all' }, ...newOptions];
  }

  // Aplica filtros de data, categoria, busca e ordenação
  public applyFiltersAndSort(): void {
    let events = [...this.allEvents];

    // filtro por categoria
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      events = events.filter(e => e.ticket_type === this.selectedCategory);
    }

    // filtro por texto
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      events = events.filter(e =>
        e.title?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // filtro por data
    if (this.selectedDate) {
      const target = this.selectedDate.getFullYear() + '-' +
        String(this.selectedDate.getMonth() + 1).padStart(2, '0') + '-' +
        String(this.selectedDate.getDate()).padStart(2, '0');
      events = events.filter(e => e.start_datetime.substring(0, 10) === target);
    }

    // ordenação por data
    events.sort((a, b) => {
      const dateA = new Date(a.start_datetime).getTime();
      const dateB = new Date(b.start_datetime).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    this.filteredEvents = events;
  }

  // Trigger ao mudar a data
  public onDateChange(): void {
    if (!this.selectedDate) {
      // Quando não há data selecionada, retorna todos os eventos
      this.filteredEvents = [...this.allEvents];
    } else {
      this.applyFiltersAndSort();
    }
  }

  // Remove imagens quebradas
  public updateImageOnError(event: Event): void {
    const element = event.target as HTMLImageElement;
    if (element) element.style.display = 'none';
  }
}
