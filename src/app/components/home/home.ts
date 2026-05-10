import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {

  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  features = [
  {
    icon: 'track_changes',
    title: "Progress Tracking",
    description: "Keep a detailed log of every problem you solve, categorized by data structure and algorithm types."
  },
  {
    icon: 'notifications_active',
    title: "Smart Reminders",
    description: "Never miss a day. Our reminders adapt to your problem difficulty and learning pace."
  },
  {
    icon: 'dashboard',
    title: "Enhanced Dashboard",
    description: "A centralized hub to manage your entire DSA journey with deep analytics and visualizations."
  },
  {
    icon: 'trending_up',
    title: "Sustainable Consistency",
    description: "Build habits that last. Focus on long-term growth instead of short bursts."
  },
  {
    icon: 'flash_on',
    title: "Difficulty Calibration",
    description: "Automatic difficulty tracking to help you move from beginner to advanced smoothly."
  },
  {
    icon: 'shield',
    title: "Community Benchmarking",
    description: "Compare your growth with other learners while maintaining your own pace."
  }
];



}
