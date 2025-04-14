import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Student } from '../../shared/interfaces/Student';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrl: './register-student.component.css'
})
export class RegisterStudentComponent implements OnInit{


  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService){}

  ngOnInit(): void {
      
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { firstName, lastName, email, password, confirmPassword } = form.value;
  
      // Validate university email format
      const emailPattern = /^[a-zA-Z]+_[0-9]+@fci\.helwan\.edu\.eg$/;
      if (!emailPattern.test(email)) {
        this.toastr.error("Please use a valid university email format: Name_ID@fci.helwan.edu.eg");
        return;
      }
  
      if (password === confirmPassword) {
        const student: Student = { firstName, lastName, email, password };
        this.authService.registerStudent(student).subscribe(
          response => {
            this.toastr.success(
              'A verification email has been sent to your university account. Please check your inbox to activate your account.',
              'Registration Successful',
              {
                timeOut: 10000, 
                // progressBar: true,
                // closeButton: true,
                positionClass: 'toast-bottom-right'
              }
            );
            this.router.navigateByUrl('/login');
          },
          error => {
            this.toastr.error(
              'Registration failed. Please try again later.',
              'Error',
              {
                timeOut: 3000,
                positionClass: 'toast-bottom-right'
              }
            );
          }
        );
      } else {
        this.toastr.error("Passwords don't match", 'Error', {
          timeOut: 3000,
          positionClass: 'toast-bottom-right'
        });
      }
    } else {
      this.toastr.warning("Please fill in all required fields correctly", 'Warning', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right'
      });
    }
  }



}
