import { TestBed } from '@angular/core/testing';

import { MonitoreoService } from './monitoreo.service';

describe('MonitoreoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitoreoService = TestBed.get(MonitoreoService);
    expect(service).toBeTruthy();
  });
});
