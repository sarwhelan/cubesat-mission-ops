import { TestBed } from '@angular/core/testing';

import { TelemLimitsService } from './telem-limits.service';

describe('TelemLimitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TelemLimitsService = TestBed.get(TelemLimitsService);
    expect(service).toBeTruthy();
  });
});
