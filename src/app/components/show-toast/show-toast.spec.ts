import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowToast } from './show-toast';

describe('ShowToast', () => {
  let component: ShowToast;
  let fixture: ComponentFixture<ShowToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowToast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowToast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
