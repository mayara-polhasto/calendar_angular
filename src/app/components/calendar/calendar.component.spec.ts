import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TimelyApiService } from '../../services/timely-api.service';
import { TimelyEvent } from 'src/app/models/event.model';
import { of } from 'rxjs';

//declarando servico mokado
const mockApiService = {
  fetchEvents: () => of([] as TimelyEvent[])
};

//dados mokados
const MOCK_EVENTS: TimelyEvent[] = [
  { title: 'Primeiro Evento', start_datetime: '2025-10-03T10:00:00', description_short: 'Desc 1', ticket_type: '', cost_display: '', featured: false, instance: '' },
  { title: 'Segundo Evento', start_datetime: '2025-10-04T11:00:00', description_short: 'Desc 2', ticket_type: '', cost_display: '', featured: false, instance: '' },
];

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let apiService: TimelyApiService;

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
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TESTE 2: chama o fetchEvents()
  it('should call fetchEvents on initialization', () => {
    // 1. observar o método
    const fetchSpy = spyOn(apiService, 'fetchEvents').and.callThrough();

    // o que inclui a execução do ngOnInit()
    fixture.detectChanges();

    // 3. foi chamado
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  //testando a manipulação dos eventos
  it('should populate events from the API', () => {
    spyOn(apiService, 'fetchEvents').and.returnValue(of(MOCK_EVENTS));
    fixture.detectChanges();
    expect(component.allEvents.length).toBe(2);
    expect(component.allEvents[0].title).toBe('Primeiro Evento');
  });

  //testando o template
  it('should render event titles', () => {
    const fetchSpy = spyOn(apiService, 'fetchEvents').and.returnValue(of(MOCK_EVENTS));

    fixture.detectChanges(); // dispara ngOnInit

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Primeiro Evento');
    expect(compiled.textContent).toContain('Segundo Evento');
  });

});
