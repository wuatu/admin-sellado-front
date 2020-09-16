import { TestBed } from '@angular/core/testing';

import { ProduccionColaboradorService } from './produccion-colaborador.service';

describe('ProduccionColaboradorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProduccionColaboradorService = TestBed.get(ProduccionColaboradorService);
    expect(service).toBeTruthy();
  });
});
