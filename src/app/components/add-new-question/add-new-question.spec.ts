import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewQuestion } from './add-new-question';

describe('AddNewQuestion', () => {
  let component: AddNewQuestion;
  let fixture: ComponentFixture<AddNewQuestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewQuestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewQuestion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
