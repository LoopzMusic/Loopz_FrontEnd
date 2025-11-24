import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarProduto } from './gerenciar-produto';

describe('GerenciarProduto', () => {
  let component: GerenciarProduto;
  let fixture: ComponentFixture<GerenciarProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarProduto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarProduto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
