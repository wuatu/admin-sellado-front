import { TestBed } from '@angular/core/testing';

import { CodigoUnitecService } from './codigo-unitec.service';

describe('CodigoUnitecService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CodigoUnitecService = TestBed.get(CodigoUnitecService);
    expect(service).toBeTruthy();
  });
});
