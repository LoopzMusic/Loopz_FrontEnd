import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMeusPedidos } from './card-meus-pedidos';

describe('CardMeusPedidos', () => {
  let component: CardMeusPedidos;
  let fixture: ComponentFixture<CardMeusPedidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMeusPedidos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMeusPedidos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
