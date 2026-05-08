import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../models/question';
import { addNewQuestion } from '../models/addNewQuestion';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = 'http://localhost:8080/questions';

  constructor(private http: HttpClient) {}

  // function for removing html tags from description
  private stripHtml(html: string): string {

    if (!html) return '';

    const doc = new DOMParser().parseFromString(html, 'text/html');

    return doc.body.textContent || '';
  }

  // GET ALL QUESTIONS
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

  // GET QUESTION BY ID
  getQuestionById(id: number): Observable<Question> {

    return this.http.get<Question>(
      `${this.baseUrl}/${id}`
    );
  }

  // ADD QUESTION
  addQuestion(question: addNewQuestion): Observable<addNewQuestion> {

    return this.http.post<addNewQuestion>(
      this.baseUrl,
      question
    );
  }

  // DELETE QUESTION
  deleteQuestion(questionId: number): Observable<string> {

    return this.http.delete(
      `${this.baseUrl}/${questionId}`,
      {
        responseType: 'text'
      }
    );
  }

  // UPDATE QUESTION
  updateQuestion(id: number, question: Question): Observable<Question> {

    return this.http.put<Question>(
      `${this.baseUrl}/${id}`,
      question
    );
  }
}