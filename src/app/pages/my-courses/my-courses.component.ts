// my-courses.component.ts
import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit {
  student!: Student;
  generalHours: number = 0;
  facultyHours: number = 0;
  departmentHours: number = 0;

  features = [
    {
      name: 'General Requirements',
      link: '/my-general',
      icon: 'fas fa-graduation-cap',
      disabled: false
    },
    {
      name: 'Faculty Requirements',
      link: '/my-faculty',
      icon: 'fas fa-university',
      disabled: false
    },
    {
      name: 'Division Requirements',
      link: '/my-department',
      icon: 'fas fa-building',
      disabled: true 
    }
  ];

  constructor(
    private authService: AuthService, 
    private router: Router,
    private coursesService: CoursesService
  ) {
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }

  ngOnInit(): void {
    this.loadTotalHours();
  
  }


  loadTotalHours(): void {
    console.log('Attempting to load total hours...');
    this.coursesService.getTotalHours().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.generalHours = response.genralHours || 0;
        this.facultyHours = response.facultyHours || 0;
        
        if (response.CSHours) this.departmentHours = response.CSHours;
        else if (response.AIHours) this.departmentHours = response.AIHours;
        else if (response.ITHours) this.departmentHours = response.ITHours;
        else if (response.ISHours) this.departmentHours = response.ISHours;
        else this.departmentHours = 0;
  
        this.features[2].disabled = this.facultyHours < 66;
      },
      error: (error) => {
        console.error('Error loading total hours:', error);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(link: string) {
    this.router.navigate([link]);
  }
}