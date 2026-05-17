import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(public router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  scrolled = false;
  mobileMenuOpen = false;
  activeTestimonial = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 20;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  features = [
    {
      icon: 'track_changes',
      title: "Progress Tracking",
      description: "Keep a detailed log of every problem you solve, categorized by data structure and algorithm types.",
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
    },
    {
      icon: 'notifications_active',
      title: "Smart Reminders",
      description: "Never miss a day. Our reminders adapt to your problem difficulty and learning pace.",
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)'
    },
    {
      icon: 'dashboard',
      title: "Enhanced Dashboard",
      description: "A centralized hub to manage your entire DSA journey with deep analytics and visualizations.",
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
    },
    {
      icon: 'trending_up',
      title: "Sustainable Consistency",
      description: "Build habits that last. Focus on long-term growth instead of short bursts.",
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #059669)'
    },
    {
      icon: 'flash_on',
      title: "Difficulty Calibration",
      description: "Automatic difficulty tracking to help you move from beginner to advanced smoothly.",
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #f97316)'
    },
    {
      icon: 'shield',
      title: "Community Benchmarking",
      description: "Compare your growth with other learners while maintaining your own pace.",
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
    }
  ];

  testimonials = [
    {
      name: "Alex Chen",
      role: "Software Engineer @ Google",
      avatar: "AC",
      text: "Recursify transformed how I approach DSA. The smart reminders kept me consistent for 200+ days straight.",
      rating: 5
    },
    {
      name: "Sarah Miller",
      role: "CS Student @ Stanford",
      avatar: "SM",
      text: "The difficulty calibration is genius. It pushed me exactly when I needed it and kept me from burning out.",
      rating: 5
    },
    {
      name: "James Park",
      role: "Frontend Developer @ Netflix",
      avatar: "JP",
      text: "Best DSA tracker I've ever used. The dashboard analytics helped me identify my weak spots instantly.",
      rating: 5
    }
  ];

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 50);
  }

  nextTestimonial() {
    this.activeTestimonial = (this.activeTestimonial + 1) % this.testimonials.length;
  }

  prevTestimonial() {
    this.activeTestimonial = (this.activeTestimonial - 1 + this.testimonials.length) % this.testimonials.length;
  }
}