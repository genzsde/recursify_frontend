import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../models/question';
import { addNewQuestion } from '../models/addNewQuestion';
import { AuthService } from './auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = 'http://localhost:8080/questions';

  constructor(private http: HttpClient, private authService: AuthService) {}

  //funciton for removing the tags from discription
  private stripHtml(html: string): string {
  if (!html) return '';

  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
  }

//all backend calling functions for the dashboard component

  allQuestions(): Observable<Question[]> {
  return this.http.get<Question[]>(this.baseUrl).pipe(
    map((questions: Question[]) =>
      questions.map(q => ({
        ...q,
        description: this.stripHtml(q.description)
      }))
    )
  );
}


  getQuestionById(id:number): Observable<Question> {
  return this.http.get<Question>(`${this.baseUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${this.authService.getToken()}`,
    },
  })
}

  addQuestion(question: addNewQuestion): Observable<addNewQuestion> {
    return this.http.post<addNewQuestion>(this.baseUrl, question);
  }

  deleteQuestion(questionId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${questionId}`, {
      responseType: 'text'
    });
  }
}
