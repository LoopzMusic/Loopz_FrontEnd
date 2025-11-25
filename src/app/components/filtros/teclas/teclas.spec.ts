import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Teclas } from './teclas';

describe('Teclas', () => {
  let component: Teclas;
  let fixture: ComponentFixture<Teclas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Teclas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Teclas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
