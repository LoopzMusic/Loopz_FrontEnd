import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaisDetalhes } from './mais-detalhes';

describe('MaisDetalhes', () => {
  let component: MaisDetalhes;
  let fixture: ComponentFixture<MaisDetalhes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaisDetalhes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaisDetalhes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
