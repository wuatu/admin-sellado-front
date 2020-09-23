import { TestBed } from '@angular/core/testing';

import { SeguimientoDeCajasService } from './seguimiento-de-cajas.service';

describe('SeguimientoDeCajasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeguimientoDeCajasService = TestBed.get(SeguimientoDeCajasService);
    expect(service).toBeTruthy();
  });
});
