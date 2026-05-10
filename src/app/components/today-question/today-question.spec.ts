import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayQuestion } from './today-question';

describe('TodayQuestion', () => {
  let component: TodayQuestion;
  let fixture: ComponentFixture<TodayQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayQuestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayQuestion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
