import { TestBed } from '@angular/core/testing';

import { LineaService } from './linea.service';

describe('LineaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineaService = TestBed.get(LineaService);
    expect(service).toBeTruthy();
  });
});
