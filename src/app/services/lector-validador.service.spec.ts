import { TestBed } from '@angular/core/testing';

import { LectorValidadorService } from './lector-validador.service';

describe('LectorValidadorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LectorValidadorService = TestBed.get(LectorValidadorService);
    expect(service).toBeTruthy();
  });
});
