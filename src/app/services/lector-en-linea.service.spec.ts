import { TestBed } from '@angular/core/testing';

import { LectorEnLineaService } from './lector-en-linea.service';

describe('LectorEnLineaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LectorEnLineaService = TestBed.get(LectorEnLineaService);
    expect(service).toBeTruthy();
  });
});
