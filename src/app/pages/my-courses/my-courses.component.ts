import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
      icon: 'fas fa-graduation-cap'
    },
    {
      name: 'Faculty Requirements',
      link: '/my-faculty',
      icon: 'fas fa-university'
    },
    {
      name: 'Division Requirements',
      link: '/my-department',
      icon: 'fas fa-building'
    }
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(link: string) {
    this.router.navigate([link]);
  }

  updateGeneralHours(hours: number) {
    this.generalHours = hours; 
  }

  updateFacultyHours(hours: number) {
    this.facultyHours = hours;
  }

  updateDepartmentHours(hours: number) {
    this.departmentHours = hours;
  }
}