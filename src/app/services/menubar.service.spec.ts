import { TestBed } from '@angular/core/testing';

import { MenubarService } from './menubar.service';

describe('MenubarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenubarService = TestBed.get(MenubarService);
    expect(service).toBeTruthy();
  });
});
