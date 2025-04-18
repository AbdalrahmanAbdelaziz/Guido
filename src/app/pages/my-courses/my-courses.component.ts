// my-courses.component.ts
import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.css']
})
export class MyCoursesComponent implements OnInit {
  student: Student | null = null; // Allow null here
  generalHours: number = 0;
  facultyHours: number = 0;
  departmentHours: number = 0;

  features = [
    { name: 'General Requirements', link: '/general-courses', icon: 'fas fa-globe' },
    { name: 'Faculty Requirements', link: '/faculty-courses', icon: 'fas fa-university' },
    { name: 'Division Requirements', link: '/department-courses', icon: 'fas fa-code-branch' }
  ];

  constructor(
    private coursesService: CoursesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudentData();
    this.loadTotalHours();
  }

  loadStudentData(): void {
    this.authService.studentObservable.subscribe({
      next: (student) => {
        this.student = student;
      },
      error: (error) => {
        console.error('Error loading student data:', error);
      }
    });
  }

  loadTotalHours(): void {
    this.coursesService.getTotalHours().subscribe({
      next: (response) => {
        this.generalHours = response.genralHours || 0;
        this.facultyHours = response.facultyHours || 0;
        
        // Set department hours based on the department-specific hours in the response
        if (response.CSHours) this.departmentHours = response.CSHours;
        else if (response.AIHours) this.departmentHours = response.AIHours;
        else if (response.ITHours) this.departmentHours = response.ITHours;
        else if (response.ISHours) this.departmentHours = response.ISHours;
        else this.departmentHours = 0;
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