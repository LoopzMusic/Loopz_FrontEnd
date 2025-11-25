import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cordas } from './cordas';

describe('Cordas', () => {
  let component: Cordas;
  let fixture: ComponentFixture<Cordas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cordas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cordas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
