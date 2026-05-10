import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../../services/dashboard';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { TodayQuestionService } from '../../services/today-question-service';
import { Question } from '../../models/question';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-today-question',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './today-question.html',
  styleUrl: './today-question.scss',
})
export class TodayQuestionComponent {
  userName: string | null = '';
  questions: Question[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor( 
    private todayQuestionService: TodayQuestionService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.userName = localStorage.getItem('userName') || 'User';
    this.loadQuestions();
  }

  loadQuestions() {
    this.loading = true;
    this.todayQuestionService.getTodayQuestion().subscribe({
      next: (res: Question[]) => {
        this.questions = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load questions:', err);
        this.error = 'Failed to load questions';
        this.loading = false;
      },
    });
  }
  
  markQuestionAsSolved(questionId: number) {
    this.todayQuestionService.makeTodayQuestion(questionId).subscribe({
      next: () => {
        this.loadQuestions();
      },
      error: (err) => {
        this.error = 'Failed to mark question as solved:';
        this.loading = false;
      },
    });
  }

  goBack() {  this.router.navigate(['/dashboard']);
  }

}
