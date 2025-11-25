import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Percussao } from './percussao';

describe('Percussao', () => {
  let component: Percussao;
  let fixture: ComponentFixture<Percussao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Percussao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Percussao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
