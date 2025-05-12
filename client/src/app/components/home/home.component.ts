// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(
      user => {
        this.isLoggedIn = !!user;
      }
    );
  }

  goToMatch(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/match']);
    } else {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: '/match' } 
      });
    }
  }
}