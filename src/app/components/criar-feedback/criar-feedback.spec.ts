import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarFeedback } from './criar-feedback';

describe('CriarFeedback', () => {
  let component: CriarFeedback;
  let fixture: ComponentFixture<CriarFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
