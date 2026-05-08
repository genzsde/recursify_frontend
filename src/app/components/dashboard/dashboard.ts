import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Question } from '../../models/question';
import { DashboardService } from '../../services/dashboard';
import { FormsModule } from '@angular/forms';

// import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
// Chart.register(ArcElement, Tooltip, Legend);
// import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {

  userName: string | null = '';

  questions: Question[] = [];

  filteredQuestions: Question[] = [];

  loading: boolean = true;

  error: string | null = null;

  showConfirm = false;

  deleteId: number | null = null;

  selectedQuestion: Question | null = null;

  showDetails = false;

  notes: string = '';

  searchText: string = '';

  difficultyFilter: string = '';

  // NOTES STATUS
  notesSaved = false;

  notesError = false;


  // @ViewChild('difficultyChart') chartRef!: ElementRef<HTMLCanvasElement>;
  // private chart: Chart | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dashboardService: DashboardService
  ) {}


  ngOnInit(): void {

    if (!this.authService.isLoggedIn()) {

      this.router.navigate(['/login']);

      return;
    }

    this.userName = localStorage.getItem('userName') || 'User';

    this.loadQuestions();
  }


  // =========================
  // LOAD QUESTIONS
  // =========================

  loadQuestions() {

    this.loading = true;

    this.dashboardService.allQuestions().subscribe({

      next: (res: Question[]) => {

        this.questions = res;

        this.filteredQuestions = res;

        this.loading = false;

        this.cdr.detectChanges();

        console.log(res);
      },

      error: (err) => {

        console.error('Failed to load questions:', err);

        this.error = 'Failed to load questions';

        this.loading = false;
      },
    });
  }


  // =========================
  // FILTERS
  // =========================

  applyFilters() {

    this.filteredQuestions = this.questions.filter(q => {

      // SEARCH
      const matchesSearch =

        !this.searchText ||

        q.title.toLowerCase()
          .includes(this.searchText.toLowerCase()) ||

        q.description.toLowerCase()
          .includes(this.searchText.toLowerCase()) ||

        String(q.questionNumber)
          .includes(this.searchText);

      // DIFFICULTY
      const matchesDifficulty =

        !this.difficultyFilter ||

        q.difficulty.toLowerCase() ===
        this.difficultyFilter.toLowerCase();

      return matchesSearch && matchesDifficulty;
    });
  }


  clearFilters() {

    this.searchText = '';

    this.difficultyFilter = '';

    this.filteredQuestions = this.questions;
  }


  // =========================
  // DETAILS MODAL
  // =========================

  openDetails(q: Question) {

    this.selectedQuestion = q;

    this.showDetails = true;

    this.notes = q.notes || '';

    // RESET STATUS
    this.notesSaved = false;

    this.notesError = false;
  }


  closeDetails() {

    this.showDetails = false;

    this.selectedQuestion = null;

    this.notes = '';

    this.notesSaved = false;

    this.notesError = false;
  }


  // =========================
  // SAVE NOTES
  // =========================

  saveNotes() {

    if (!this.selectedQuestion) return;

    const updatedQuestion: Question = {

      ...this.selectedQuestion,

      notes: this.notes
    };

    this.dashboardService
      .updateQuestion(
        this.selectedQuestion.id,
        updatedQuestion
      )
      .subscribe({

        next: (res) => {

          // UPDATE CURRENT QUESTION
          this.selectedQuestion!.notes = res.notes;

          // UPDATE QUESTIONS ARRAY
          const index = this.questions.findIndex(
            q => q.id === res.id
          );

          if (index !== -1) {

            this.questions[index].notes = res.notes;
          }

          // UPDATE FILTERED ARRAY
          const filteredIndex =
            this.filteredQuestions.findIndex(
              q => q.id === res.id
            );

          if (filteredIndex !== -1) {

            this.filteredQuestions[filteredIndex].notes =
              res.notes;
          }

          // SUCCESS MESSAGE
          this.notesSaved = true;

          this.notesError = false;
          this.cdr.detectChanges();

          setTimeout(() => {

            this.notesSaved = false;
            this.cdr.detectChanges();

          }, 2500);
        },

        error: (err) => {

          console.error(
            'Failed to save notes',
            err
          );

          // ERROR MESSAGE
          this.notesError = true;

          this.notesSaved = false;
          this.cdr.detectChanges();

          setTimeout(() => {

            this.notesError = false;
            this.cdr.detectChanges();

          }, 2500);
        }
      });
  }


  // =========================
  // DELETE
  // =========================

  openDeletePopup(id: number) {

    this.deleteId = id;

    this.showConfirm = true;
  }


  cancelDelete() {

    this.showConfirm = false;

    this.deleteId = null;
  }


  confirmDelete() {

    if (this.deleteId === null) return;

    this.dashboardService
      .deleteQuestion(this.deleteId)
      .subscribe({

        next: () => {

          this.loadQuestions();

          this.showConfirm = false;

          this.deleteId = null;
        },

        error: (err) => {

          console.error(err);
        }
      });
  }


  // =========================
  // NAVIGATION
  // =========================

  logout() {

    this.authService.logout();

    this.router.navigate(['/home']);
  }


  goToTodayQuestion() {

    this.router.navigate(['/today-question']);
  }

}