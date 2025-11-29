import { TestBed } from '@angular/core/testing';

import { Administrativo } from './administrativo';

describe('Administrativo', () => {
  let service: Administrativo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Administrativo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
