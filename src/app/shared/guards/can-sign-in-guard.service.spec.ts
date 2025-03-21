import { TestBed } from '@angular/core/testing';

import { CanSignInGuardService } from './can-sign-in-guard.service';

describe('CanSignInGuardService', () => {
  let service: CanSignInGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanSignInGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
