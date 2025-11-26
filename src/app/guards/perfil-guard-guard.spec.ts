import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { perfilGuardGuard } from './perfil-guard-guard';

describe('perfilGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => perfilGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
