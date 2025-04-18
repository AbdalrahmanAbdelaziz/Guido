import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  student!: Student;
  newPassword: string = '';
  confirmPassword: string = '';
  isDarkMode = false;
  isUpdating = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    private darkModeService: DarkModeService
  ) {
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
  }

  updatePassword(): void {
    if (this.isUpdating) return;
    
    // Validate inputs
    if (!this.newPassword || !this.confirmPassword) {
      this.toastrService.warning('Please fill in all password fields');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastrService.warning('Passwords do not match');
      return;
    }

    if (this.newPassword.length < 8) {
      this.toastrService.warning('Password must be at least 8 characters long');
      return;
    }

    this.isUpdating = true;
    
    this.authService.updatePassword(this.newPassword, this.confirmPassword).subscribe({
      next: () => {
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: () => {
        this.isUpdating = false;
      },
      complete: () => {
        this.isUpdating = false;
      }
    });
  }
}