import { TestBed } from '@angular/core/testing';

import { ProduccionPorCalibradorService } from './produccion-por-calibrador.service';

describe('ProduccionPorCalibradorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProduccionPorCalibradorService = TestBed.get(ProduccionPorCalibradorService);
    expect(service).toBeTruthy();
  });
});
