import { TestBed } from '@angular/core/testing';

import { TodayQuestionService } from './today-question-service';

describe('TodayQuestionService', () => {
  let service: TodayQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodayQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
