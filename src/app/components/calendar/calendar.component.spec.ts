import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TimelyApiService } from '../../services/timely-api.service';
import { TimelyEvent } from 'src/app/models/event.model';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';

//declarando servico mokado
const mockApiService = {
  fetchEvents: () => of([] as TimelyEvent[])
};

//dados mokados
const MOCK_EVENTS: TimelyEvent[] = [
  { title: 'First event', start_datetime: '2025-10-03T10:00:00', description_short: 'Desc 1', ticket_type: '', cost_display: '', featured: false, instance: '' },
  { title: 'Second event', start_datetime: '2025-10-04T11:00:00', description_short: 'Desc 2', ticket_type: '', cost_display: '', featured: false, instance: '' },
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

});
