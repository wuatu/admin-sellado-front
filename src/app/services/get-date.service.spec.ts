import { TestBed } from '@angular/core/testing';

import { GetDateService } from './get-date.service';

describe('GetDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetDateService = TestBed.get(GetDateService);
    expect(service).toBeTruthy();
  });
});
