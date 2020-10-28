import { TestBed } from '@angular/core/testing';

import { RegistroProduccionService } from './registro-produccion.service';

describe('RegistroProduccionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistroProduccionService = TestBed.get(RegistroProduccionService);
    expect(service).toBeTruthy();
  });
});
