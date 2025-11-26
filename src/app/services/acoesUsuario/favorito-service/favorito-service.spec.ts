import { TestBed } from '@angular/core/testing';

import { FavoritosService } from './favorito-service';

describe('FavoritoService', () => {
  let service: FavoritosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
