import { TestBed } from '@angular/core/testing';

import { MonitoreoUsuarioEnLineaService } from './monitoreo-usuario-en-linea.service';

describe('MonitoreoUsuarioEnLineaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitoreoUsuarioEnLineaService = TestBed.get(MonitoreoUsuarioEnLineaService);
    expect(service).toBeTruthy();
  });
});
