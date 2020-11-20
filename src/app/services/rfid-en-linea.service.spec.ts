import { TestBed } from '@angular/core/testing';

import { RfidEnLineaService } from './rfid-en-linea.service';

describe('RfidEnLineaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RfidEnLineaService = TestBed.get(RfidEnLineaService);
    expect(service).toBeTruthy();
  });
});
