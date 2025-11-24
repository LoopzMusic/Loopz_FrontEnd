import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoVendido } from './produto-vendido';

describe('ProdutoVendido', () => {
  let component: ProdutoVendido;
  let fixture: ComponentFixture<ProdutoVendido>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoVendido]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoVendido);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
