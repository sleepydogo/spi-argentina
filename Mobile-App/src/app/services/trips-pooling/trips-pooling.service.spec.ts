import { TestBed } from '@angular/core/testing';

import { TripsPoolingService } from './trips-pooling.service';

describe('TripsPoolingService', () => {
  let service: TripsPoolingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripsPoolingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
