import { TestBed } from '@angular/core/testing';

import { MonitoreoCalibradoresService } from './monitoreo-calibradores.service';

describe('MonitoreoCalibradoresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitoreoCalibradoresService = TestBed.get(MonitoreoCalibradoresService);
    expect(service).toBeTruthy();
  });
});
