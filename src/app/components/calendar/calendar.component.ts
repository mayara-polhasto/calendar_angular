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
  public selectedDate: Date | null = new Date();

  //eventos
  private allEvents: TimelyEvent[] = [];
  public filteredEvents: TimelyEvent[] = [];
  //filtros
  public searchTerm: string = '';
  public sortOrder: 'asc' | 'desc' = 'asc';
  public categories: string[] = [];
  public selectedCategory: string = 'all';
  //opcoes do filtro
  public sortOptions: any[] = [
    { label: 'Date (Oldest First)', value: 'asc' },
    { label: 'Date (Newest First)', value: 'desc' }
  ];
  public categoryOptions: any[] = [
    { label: 'All', value: 'all' }
  ];


  constructor(private apiService: TimelyApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    const today = new Date();
    const formattedDate = this.datePipe.transform(today, 'yyyy-MM-dd') || undefined;
    this.isLoading = true;
    this.error = null;
    this.sortOptions = [
      { label: 'Date (Oldest First)', value: 'asc' },
      { label: 'Date (Newest First)', value: 'desc' }
    ];
    this.categoryOptions = [{ label: 'All', value: 'all' }];
    this.fetchAndDisplayEvents();

    this.apiService.fetchEvents(formattedDate).subscribe({
      next: (eventsArray: TimelyEvent[]) => {
        this.allEvents = eventsArray;
        this.extractCategories();
        this.applyFiltersAndSort();
        this.isLoading = false;
      },

      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.error = err.message;
        console.error("Ocorreu um erro no componente:", err);
      }
    });
  }

  private extractCategories(): void {
    const allTicketTypes = this.allEvents.map(event => event.ticket_type);
    // categoria apareça apenas uma vez
    this.categories = [...new Set(allTicketTypes)];
    const newOptions = this.categories.map(cat => ({ label: cat, value: cat }));
    this.categoryOptions = [{ label: 'All', value: 'all' }, ...newOptions];
  }


  //filtro de texto e a ordenação   
  applyFiltersAndSort(): void {
    let events = [...this.allEvents];

    if (this.selectedCategory && this.selectedCategory !== 'all') {
      events = events.filter(event => event.ticket_type === this.selectedCategory);
    }

    // 2. filtro de busca por texto
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      events = events.filter(event =>
        event.title?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // 3. ordenação por data
    events.sort((a, b) => {
      const dateA = new Date(a.start_datetime).getTime();
      const dateB = new Date(b.start_datetime).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // 4. Atualiza a lista
    this.filteredEvents = events;
  }

  public onDateChange(): void {
    this.fetchAndDisplayEvents(this.selectedDate);
  }

  public clearDateFilter(): void {
    this.selectedDate = null;
    this.fetchAndDisplayEvents();
  }

  private fetchAndDisplayEvents(dateToFilter?: Date | null): void {
    this.isLoading = true;
    this.error = null;

    const formattedDate = dateToFilter
      ? this.datePipe.transform(dateToFilter, 'yyyy-MM-dd') || undefined
      : undefined;

    this.apiService.fetchEvents(formattedDate).subscribe({
      next: (eventsArray: TimelyEvent[]) => {
        this.allEvents = eventsArray;
        this.extractCategories();
        this.applyFiltersAndSort();
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
      element.style.display = 'none';
    }
  }
}