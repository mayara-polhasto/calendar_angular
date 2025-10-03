import { TestBed } from '@angular/core/testing';

import { TimelyApiService } from './timely-api.service';

describe('TimelyApiService', () => {
  let service: TimelyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
