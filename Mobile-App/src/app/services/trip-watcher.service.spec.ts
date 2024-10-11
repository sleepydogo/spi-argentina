import { TestBed } from '@angular/core/testing';

import { TripWatcherService } from './trip-watcher.service';

describe('TripWatcherService', () => {
  let service: TripWatcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripWatcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
