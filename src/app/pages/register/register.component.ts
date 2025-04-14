import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  constructor(private router: Router){}

  ngOnInit(): void {
      
  }

  signUp(role: string): void {
    if (role === 'student') {
      this.router.navigateByUrl('/registerStudent');

    } else if (role === 'coach') {
       this.router.navigateByUrl('/registerAdmin');
    }
  }

  logIn(): void {
    this.router.navigateByUrl('/login');
  }

  

}
