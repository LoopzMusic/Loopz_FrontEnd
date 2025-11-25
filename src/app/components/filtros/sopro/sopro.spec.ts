import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sopro } from './sopro';

describe('Sopro', () => {
  let component: Sopro;
  let fixture: ComponentFixture<Sopro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sopro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sopro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
