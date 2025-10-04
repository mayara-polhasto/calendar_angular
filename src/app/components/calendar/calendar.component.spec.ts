import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TimelyApiService } from '../../services/timely-api.service';
import { TimelyEvent } from 'src/app/models/event.model';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';

//declarando servico mokado
const mockApiService = {
  fetchEvents: () => of([] as TimelyEvent[])
};

//dados mokados
const MOCK_EVENTS: TimelyEvent[] = [
  {
    title: 'First event',
    start_datetime: '2025-10-03T10:00:00',
    description_short: 'Short description 1',
    ticket_type: '',
    cost_display: '',
    featured: false,
    instance: '',
    image: { urls: { medium: 'image1.jpg' } }
  },
  {
    title: 'Second event',
    start_datetime: '2025-10-04T11:00:00',
    description_short: 'Short description 2',
    ticket_type: '',
    cost_display: '',
    featured: false,
    instance: '',
    image: { urls: { medium: 'image2.jpg' } }
  },
];

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let apiService: TimelyApiService;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: TimelyApiService, useValue: mockApiService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(TimelyApiService);
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTE 2: chama o fetchEvents()
  it('should call fetchEvents on initialization', () => {
    // 1. observar o método
    const fetchSpy = spyOn(apiService, 'fetchEvents').and.callThrough();

    fixture.detectChanges();

    //verificar se foi chamado
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  //testando a manipulação dos eventos
  it('should populate events from the API', () => {
    spyOn(apiService, 'fetchEvents').and.returnValue(of(MOCK_EVENTS));
    fixture.detectChanges();
    expect(component.allEvents.length).toBe(2);
    expect(component.allEvents[0].title).toBe('First event');
  });

  //testando o template
  it('should render event titles', () => {
    // Mock do serviço com eventos
    spyOn(apiService, 'fetchEvents').and.returnValue(of(MOCK_EVENTS));

    // Dispara o ngOnInit e atualiza o DOM
    fixture.detectChanges();

    // Seleciona os elementos do DOM
    const titles = fixture.nativeElement.querySelectorAll('.card-title');

    // Checa se os títulos estão corretos
    expect(titles.length).toBe(2);
    expect(titles[0].textContent).toContain('First event');
    expect(titles[1].textContent).toContain('Second event');
  });

  it('should render event titles, dates and descriptions', () => {
    spyOn(apiService, 'fetchEvents').and.returnValue(of(MOCK_EVENTS));
    fixture.detectChanges();

    const titleElements = fixture.nativeElement.querySelectorAll('.card-title');
    const dateElements = fixture.nativeElement.querySelectorAll('.card-date');
    const descElements = fixture.nativeElement.querySelectorAll('.card-description');

    expect(titleElements.length).toBe(2);
    expect(titleElements[0].textContent).toContain('First event');
    expect(titleElements[1].textContent).toContain('Second event');

    expect(dateElements[0].textContent).toContain('03/10/2025');
    expect(dateElements[1].textContent).toContain('04/10/2025');

    expect(descElements[0].textContent).toContain('Short description 1');
    expect(descElements[1].textContent).toContain('Short description 2');
  });

  it('should render images if available', () => {
    spyOn(apiService, 'fetchEvents').and.returnValue(of(MOCK_EVENTS));
    fixture.detectChanges();

    const imgElements = fixture.nativeElement.querySelectorAll('img');
    expect(imgElements.length).toBe(2);
    expect(imgElements[0].src).toContain('image1.jpg');
    expect(imgElements[1].src).toContain('image2.jpg');
  });

  it('should apply search filter correctly', () => {
    spyOn(apiService, 'fetchEvents').and.returnValue(of(MOCK_EVENTS));
    fixture.detectChanges();

    component.searchTerm = 'First';
    component.applyFiltersAndSort();
    fixture.detectChanges();

    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].title).toBe('First event');
  });

  it('should apply date filter correctly', () => {
    spyOn(apiService, 'fetchEvents').and.returnValue(of(MOCK_EVENTS));
    fixture.detectChanges();

    // Definindo a data com precisão do componente (mesmo formato)
    component.selectedDate = new Date('2025-10-04T00:00:00');
    component.onDateChange();
    fixture.detectChanges();

    expect(component.filteredEvents.length).toBe(1);

    // Ajuste do título para casar com mock
    expect(component.filteredEvents[0].title).toBe('Second event');
  });

  it('should show error message when API fails', () => {
    spyOn(apiService, 'fetchEvents').and.returnValue(throwError(() => new Error('API error')));
    fixture.detectChanges();
    expect(component.error).toBe('Unable to load events. Please try again later.');
  });

  it('should show "No events found" message when filteredEvents is empty', () => {
    spyOn(apiService, 'fetchEvents').and.returnValue(of([]));
    fixture.detectChanges();

    const noEventsMsg = fixture.nativeElement.querySelector('.feedback-message p');
    expect(noEventsMsg.textContent).toContain('No events found for this date.');
  });

});
