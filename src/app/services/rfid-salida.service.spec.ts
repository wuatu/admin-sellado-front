import { TestBed } from '@angular/core/testing';

import { RfidSalidaService } from './rfid-salida.service';

describe('RfidSalidaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RfidSalidaService = TestBed.get(RfidSalidaService);
    expect(service).toBeTruthy();
  });
});
