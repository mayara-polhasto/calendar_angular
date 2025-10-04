import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TimelyApiService } from './timely-api.service';
import { environment } from 'src/environments/environment';
import { ApiListResponse, ApiResponse } from '../models/api-response.model';
import { CalendarInfo } from '../models/calendar-info.model';
import { TimelyEvent } from '../models/event.model';

// conjunto de testes para o TimelyApiService
describe('Test TimelyApiService', () => {
  let service: TimelyApiService;
  let httpMock: HttpTestingController;

  // dados mokados
  const mockCalendarInfo: ApiResponse<CalendarInfo> = {
    data: { id: 'mock-calendar-id' }
  };

  const mockEvents: TimelyEvent[] = [
    { title: 'Event 1', start_datetime: '2025-10-03T10:00:00', description_short: 'Desc 1', ticket_type: '', cost_display: '', featured: false, instance: '' },
    { title: 'Event 2', start_datetime: '2025-10-04T11:00:00', description_short: 'Desc 2', ticket_type: '', cost_display: '', featured: false, instance: '' },
  ];

  const mockEventsResponse: ApiListResponse<TimelyEvent> = {
    data: {
      items: mockEvents
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TimelyApiService]
    });
    // controlador de mock HTTP
    service = TestBed.inject(TimelyApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // garante que não há nenhuma requisição HTTP pendente ou inesperada.
    httpMock.verify();
  });

  // servico criado
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TESTE 1: tudo funciona
  it('should return an array of TimelyEvents on successful API calls', () => {
    let actualEvents: TimelyEvent[] | undefined;

    // 1. testando a função
    service.fetchEvents().subscribe(events => {
      actualEvents = events;
    });

    // 2. primeira chamada de API (para /info)
    const infoReq = httpMock.expectOne(`${environment.apiUrl}info?url=${environment.calendarUrl}`);
    expect(infoReq.request.method).toBe('GET');
    infoReq.flush(mockCalendarInfo); // Fornecemos a resposta falsa

    // 3. segunda chamada de API (para /events)
    const eventsReq = httpMock.expectOne(`${environment.apiUrl}${mockCalendarInfo.data.id}/events`);
    expect(eventsReq.request.method).toBe('GET');
    eventsReq.flush(mockEventsResponse);

    // 4. retorno esperado
    expect(actualEvents).toEqual(mockEvents);
    expect(actualEvents?.length).toBe(2);
    expect(actualEvents?.[0].title).toBe('Event 1');
  });

  // TESTE 2: erro api
  it('should return a user-friendly error when the API call fails', () => {
    const mockError = { status: 500, statusText: 'Internal Server Error' };
    const expectedErrorMessage = 'Unable to load events. Please try again later.';

    // 1. teste bloco 'error'
    service.fetchEvents().subscribe({
      next: () => fail('expected an error, but it succeeded'),
      error: (err: Error) => {
        // 3. handleError
        expect(err.message).toBe(expectedErrorMessage);
      }
    });

    // 2. API dando erro
    const infoReq = httpMock.expectOne(`${environment.apiUrl}info?url=${environment.calendarUrl}`);
    infoReq.flush(null, mockError);
  });

  // TESTE 3: sem eventos
  it('should return an empty array when no events are available', () => {
    service.fetchEvents().subscribe(events => {
      expect(events.length).toBe(0);
    });

    const infoReq = httpMock.expectOne(`${environment.apiUrl}info?url=${environment.calendarUrl}`);
    infoReq.flush(mockCalendarInfo);

    const eventsReq = httpMock.expectOne(`${environment.apiUrl}${mockCalendarInfo.data.id}/events`);
    eventsReq.flush({ data: { items: [] } });
  });

  // TESTE 4: erro na segunda chamada da API (/events)
  it('should return a user-friendly error when the events API call fails', () => {
    const mockError = { status: 500, statusText: 'Internal Server Error' };
    const expectedErrorMessage = 'Unable to load events. Please try again later.';

    service.fetchEvents().subscribe({
      next: () => fail('expected an error, but it succeeded'),
      error: (err: Error) => {
        expect(err.message).toBe(expectedErrorMessage);
      }
    });

    // /info retorna sucesso
    const infoReq = httpMock.expectOne(`${environment.apiUrl}info?url=${environment.calendarUrl}`);
    infoReq.flush(mockCalendarInfo);

    // /events retorna erro
    const eventsReq = httpMock.expectOne(`${environment.apiUrl}${mockCalendarInfo.data.id}/events`);
    eventsReq.flush(null, mockError);
  });

});