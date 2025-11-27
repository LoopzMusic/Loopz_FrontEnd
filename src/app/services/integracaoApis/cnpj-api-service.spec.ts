import { TestBed } from '@angular/core/testing';

import { CnpjApiService } from './cnpj-api-service';

describe('CnpjApiService', () => {
  let service: CnpjApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CnpjApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
