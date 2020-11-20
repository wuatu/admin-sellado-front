import { TestBed } from '@angular/core/testing';

import { MonitoreoSistemaService } from './monitoreo-sistema.service';

describe('MonitoreoSistemaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitoreoSistemaService = TestBed.get(MonitoreoSistemaService);
    expect(service).toBeTruthy();
  });
});
