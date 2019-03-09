import { TestBed } from '@angular/core/testing';

import { PassLimitService } from './pass-limit.service';

describe('PassLimitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PassLimitService = TestBed.get(PassLimitService);
    expect(service).toBeTruthy();
  });
});
