import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { StudentHeaderComponent } from '../student-header/student-header.component';
import { Student } from '../../shared/DTOs/Student';
import { Course } from '../../shared/DTOs/Course';
import { AuthService } from '../../services/auth.service';
import { DarkModeService } from '../../services/dark-mode.service';
import { CoursesService } from '../../services/courses.service';
import { ToastrService } from 'ngx-toastr';
import { UpdateCourse } from '../../shared/DTOs/UpdateCourse';

@Component({
  selector: 'app-my-general',
  imports: [
    CommonModule,
    StudentHeaderComponent,
    TranslocoModule,
    FormsModule
  ],
  templateUrl: './my-general.component.html',
  styleUrls: ['./my-general.component.css'],

})

export class MyGeneralComponent implements OnInit {
  student!: Student | null;
  allCourses: Course[] = [];
  coreCourses: Course[] = [];
  electiveCourses: Course[] = [];
  selectedCourses: Course[] = [];
  totalHours: number = 0;
  isDarkMode = false;
  disabledCourses: string[] = [];
  showAddButtonMap: { [courseCode: string]: boolean } = {};

  constructor(
    private authService: AuthService, 
    private darkModeService: DarkModeService, 
    private coursesService: CoursesService,
    private toastr: ToastrService,
    public  translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkMode();

    this.authService.studentObservable.subscribe((student) => {
      this.student = student;
    });

    this.coursesService.fetchGeneralCoreCourses().subscribe((coreCourses) => {
      this.coreCourses = coreCourses.map((course) => {
        this.showAddButtonMap[course.code] = !course.grade || course.grade === 'none';
        return {
          ...course,
          grade: course.grade || 'none'
        };
      });
      this.allCourses = [...this.coreCourses, ...this.electiveCourses];
      this.updateTotalHours();
    });

    this.coursesService.fetchGeneralElectiveCourses().subscribe((electiveCourses) => {
      this.electiveCourses = electiveCourses.map((course) => {
        this.showAddButtonMap[course.code] = !course.grade || course.grade === 'none';
        return {
          ...course,
          grade: course.grade || 'none'
        };
      });
      this.allCourses = [...this.coreCourses, ...this.electiveCourses];
      this.updateTotalHours();
    });
  }

  canTakeCourse(course: Course): boolean {
    if (!course.prerequest) return true;
    const preRequestCourse = this.allCourses.find((c) => c.code === course.prerequest);
    return preRequestCourse?.grade !== 'none' && preRequestCourse?.grade !== 'F';
  }

  calculateTotalHours(): number {
    return [...this.coreCourses, ...this.electiveCourses]
      .filter((course) => course.grade !== 'none' && course.grade !== 'F') 
      .reduce((total, course) => total + (parseFloat(course.hours) || 0), 0); 
  }

  updateTotalHours(): void {
    this.totalHours = this.calculateTotalHours();
  }

  addCourse(course: Course): void {
    if (!course.grade || course.grade === 'none') {
        this.toastr.warning(this.translocoService.translate('myGeneral.selectGradeWarning'));
        return;
    }
  
    if (!this.canTakeCourse(course)) {
        this.toastr.error(this.translocoService.translate('myGeneral.prerequisiteError'));
        return;
    }
  
    if (!course.code) {
        this.toastr.error(this.translocoService.translate('myGeneral.missingCodeError'));
        return;
    }
  
    this.showAddButtonMap[course.code] = false;
  
    const updateCourse: UpdateCourse = {
        code: course.code,
        grade: course.grade,
        hours: parseInt(course.hours)
    };
  
  this.coursesService.updateCourse(updateCourse).subscribe({
    next: (response) => {
        if (response && response.message === "Updated Successfully.") {
            this.toastr.success(
                this.translocoService.translate('faculty.courseAdded', { courseName: course.course_Name })
            );
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Increased to 3 seconds to allow toast to display
        } else {
            this.showAddButtonMap[course.code] = true;
            this.toastr.warning(
                this.translocoService.translate('myGeneral.updateWarning', { courseName: course.course_Name })
            );
        }
    },
        error: (error) => {
            this.showAddButtonMap[course.code] = true;
            this.toastr.error(
                this.translocoService.translate('myGeneral.addError', { courseName: course.course_Name })
            );
        }
    });
  }

  isCourseDisabled(course: Course): boolean {
    return this.disabledCourses.includes(course.code);
  }
}

function trigger(arg0: string, arg1: any[]): any {
  throw new Error('Function not implemented.');
}

