import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../models/question';
import { Observable } from 'rxjs';
import { AuthService } from './auth';
import { addNewQuestion } from '../models/addNewQuestion';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TodayQuestionService {
  private baseUrl = 'http://localhost:8080/questions';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private stripHtml(html: string): string {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
  }

  getTodayQuestion(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/today`).pipe(map((questions: Question[]) =>
      questions.map(q => ({
        ...q,
        description: this.stripHtml(q.description)
      }))
    ));
  }

  makeTodayQuestion(questionId: number): Observable<addNewQuestion> {
    return this.http.post<addNewQuestion>(
      `${this.baseUrl}/${questionId}/solve`,
      {}
    );
  }
}
