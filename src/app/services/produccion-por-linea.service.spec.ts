import { TestBed } from '@angular/core/testing';

import { ProduccionPorLineaService } from './produccion-por-linea.service';

describe('ProduccionPorLineaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProduccionPorLineaService = TestBed.get(ProduccionPorLineaService);
    expect(service).toBeTruthy();
  });
});
