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
  imports: [CommonModule,FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  userName: string | null = '';
  questions: Question[] = [];
  loading: boolean = true;
  error: string | null = null;
  showConfirm = false;
  deleteId: number | null = null;
  selectedQuestion: Question | null = null;
  showDetails = false;
  notes: string = '';
  filteredQuestions: Question[] = [];
  searchText: string = '';
  difficultyFilter: string = '';


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


//   createDifficultyChart() {

//   if (!this.chartRef) return;

//   let easy = 0, medium = 0, hard = 0;

//   this.questions.forEach(q => {
//     const diff = q.difficulty?.toLowerCase();
//     if (diff === 'easy') easy++;
//     else if (diff === 'medium') medium++;
//     else if (diff === 'hard') hard++;
//   });

//   // destroy old chart when reloading questions
//   if (this.chart) {
//     this.chart.destroy();
//   }

//   this.chart = new Chart(this.chartRef.nativeElement, {
//     type: 'pie',
//     data: {
//       labels: ['Easy', 'Medium', 'Hard'],
//       datasets: [{
//         data: [easy, medium, hard],
//         backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
//         borderWidth: 0
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           position: 'bottom'
//         }
//       }
//     }
//   });
// }



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


  applyFilters() {

  const today = new Date().toISOString().split('T')[0];

  this.filteredQuestions = this.questions.filter(q => {

    // search
    const matchesSearch =
      !this.searchText ||
      q.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      q.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
      String(q.questionNumber).includes(this.searchText);

    // difficulty
    const matchesDifficulty =
      !this.difficultyFilter ||
      q.difficulty.toLowerCase() === this.difficultyFilter.toLowerCase();

    // status


    return matchesSearch && matchesDifficulty ;
  });
}

clearFilters(){
  this.searchText = '';
  this.difficultyFilter = '';
  this.filteredQuestions = this.questions;
}

    //opening the card function
    openDetails(q: Question) {
  this.selectedQuestion = q;
  this.showDetails = true;

  // load saved notes (local storage per question)
  this.notes = localStorage.getItem('notes_' + q.id) || '';
}

//closing the card function
closeDetails() {
  this.showDetails = false;
  this.selectedQuestion = null;
}

saveNotes() {
  if (!this.selectedQuestion) return;
  localStorage.setItem('notes_' + this.selectedQuestion.id, this.notes);
}


//deleting the question from the dashboard - direct way
//   deleteQuestion(id: number) {
//   this.dashboardService.deleteQuestion(id).subscribe({
//     next: () => {
//       this.loadQuestions();  // re-fetch from backend
//     }
//   });
// }

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

  this.dashboardService.deleteQuestion(this.deleteId).subscribe({
    next: () => {
      this.loadQuestions();
      this.showConfirm = false;
      this.deleteId = null;
    }
  });
}



  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  // goToAddQuestion() {
  // this.router.navigate(['/add-question']);
  // }

  goToTodayQuestion() {
    this.router.navigate(['/today-question']);
  }

}
