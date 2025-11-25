import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Acessorios } from './acessorios';

describe('Acessorios', () => {
  let component: Acessorios;
  let fixture: ComponentFixture<Acessorios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Acessorios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Acessorios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
