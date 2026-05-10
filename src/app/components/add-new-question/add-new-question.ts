import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addNewQuestion } from '../../models/addNewQuestion';
import { AuthService } from '../../services/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-new-question',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-new-question.html',
  styleUrls: ['./add-new-question.scss'],
})
export class AddNewQuestionComponent {

  userName: string | null = '';

  //for updating question
  editMode: boolean = false;
  editId: number | null = null;


  question: addNewQuestion = {
  title: '',
  description: '',
  questionNumber: 0,
  difficulty: 'EASY',
  link: ''
  };


  successMessage = '';
  errorMessage = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {



    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.userName = localStorage.getItem('userName') || 'User';

    // this.route.queryParams.subscribe(params => {
    //   if (params['id']) {
    //     this.editMode = true;
    //     this.editId = Number(params['id']);
    //     this.loadQuestion(this.editId);
    // }});

  }

  submit() {
    this.successMessage = '';
    this.errorMessage = '';

    this.dashboardService.addQuestion(this.question).subscribe({
      next: () => {
          this.successMessage = '✅ Question added successfully';

          this.question = {
            title: '',
            description: '',
            questionNumber: 0,
            difficulty: 'EASY',
            link: ''
          };

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1200);
        },
             error: (err) => {

      this.errorMessage = err?.error?.error || 'Failed to add question. Please try again.';
      this.cdr.detectChanges();
      setTimeout(() => {
            this.errorMessage = '';
      }, 1200);
    }
    });
  }

  // loadQuestion(editId: number)
  // {
  //   if(this.editMode && this.editId !== null)
  //   {
  //     this.dashboardService.getQuestionById(this.editId).subscribe({
  //       next: (res) => {
  //         this.question = {
  //           title: res.title,
  //           description: res.description,
  //           questionNumber: res.questionNumber,
  //           difficulty: res.difficulty as 'EASY' | 'MEDIUM' | 'HARD',
  //           link: res.link
  //         };
  //         this.editMode=false;
  //       }
  //     })
  //   }
  // }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
