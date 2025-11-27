import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarEmpresa } from './cadastrar-empresa';

describe('CadastrarEmpresa', () => {
  let component: CadastrarEmpresa;
  let fixture: ComponentFixture<CadastrarEmpresa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarEmpresa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarEmpresa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
