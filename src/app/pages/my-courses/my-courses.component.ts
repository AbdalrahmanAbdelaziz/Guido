import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { StudentHeaderComponent } from '../student-header/student-header.component';
import { Student } from '../../shared/DTOs/Student';
import { CoursesService } from '../../services/courses.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [ 
    CommonModule, 
    RouterModule, 
    FormsModule,
    TranslocoModule,
    StudentHeaderComponent
  ],
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
      name: 'myCourses.generalRequirements',
      link: '/my-general',
      icon: 'fas fa-graduation-cap',
      disabled: false
    },
    {
      name: 'myCourses.facultyRequirements',
      link: '/my-faculty',
      icon: 'fas fa-university',
      disabled: false
    },
    {
      name: 'myCourses.divisionRequirements',
      link: '/my-department',
      icon: 'fas fa-building',
      disabled: true 
    }
  ];

  constructor(
    private authService: AuthService, 
    private router: Router,
    private coursesService: CoursesService,
    private translocoService: TranslocoService
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
    this.coursesService.getTotalHours().subscribe({
      next: (response) => {
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

  getActiveLang(): string {
    return this.translocoService.getActiveLang();
  }

  changeLanguage(lang: string): void {
    this.translocoService.setActiveLang(lang);
  }
}