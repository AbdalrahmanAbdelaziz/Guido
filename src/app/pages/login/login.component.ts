import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted = false; 
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  get fc() {
    return this.loginForm.controls;
  }

  submit(): void {
    this.isSubmitted = true;
    console.log('Form submission started');

    if (this.loginForm.invalid) {
      console.log('Form invalid, errors:', {
        email: this.fc['email'].errors,
        password: this.fc['password'].errors
      });
      this.toastr.warning('Please fill all required fields');
      return;
    }

    console.log('Form valid, submitting:', this.loginForm.value);
    
    this.authService.login({
      email: this.fc['email'].value,
      password: this.fc['password'].value
    }).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        const userRole = response.data.role;
        
        if (userRole === 'Student') {
          this.router.navigateByUrl('/student-page');
        } else if (userRole === 'Admin') {
          this.router.navigateByUrl('/admin-page');
        } else {
          this.toastr.warning('Unknown user role, redirecting to home');
          this.router.navigateByUrl('/');
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        this.toastr.error('Login failed. Please check your credentials.');
      }
    });
  }
}