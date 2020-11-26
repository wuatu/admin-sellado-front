import { TestBed } from '@angular/core/testing';

import { RfidRegistroColaboradorService } from './rfid-registro-colaborador.service';

describe('RfidRegistroColaboradorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RfidRegistroColaboradorService = TestBed.get(RfidRegistroColaboradorService);
    expect(service).toBeTruthy();
  });
});
