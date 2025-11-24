import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAvaliacao } from './card-avaliacao';

describe('CardAvaliacao', () => {
  let component: CardAvaliacao;
  let fixture: ComponentFixture<CardAvaliacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAvaliacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAvaliacao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
