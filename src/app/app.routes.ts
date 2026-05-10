import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AddNewQuestionComponent } from './components/add-new-question/add-new-question';
import { TodayQuestionComponent } from './components/today-question/today-question';
import { AuthGuard } from './guards/auth-guard';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent },
    { path: 'login', component:  LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'add-question', component: AddNewQuestionComponent, canActivate: [AuthGuard] },
    { path: 'today-question', component: TodayQuestionComponent, canActivate: [AuthGuard] }
];
