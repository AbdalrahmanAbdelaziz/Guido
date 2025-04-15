import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../shared/interfaces/Course';
import { Student } from '../../shared/interfaces/Student';
import { UpdateCourse } from '../../shared/interfaces/UpdateCourse';
import { trigger, transition, style, animate } from '@angular/animations';
import { DarkModeService } from '../../services/dark-mode.service';
import { CoursesService } from '../../services/courses.service';
import { ToastrService } from 'ngx-toastr';
import { SharedHoursService } from '../../services/shared-hours.service';

@Component({
  selector: 'app-my-general',
  templateUrl: './my-general.component.html',
  styleUrls: ['./my-general.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(30px)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class MyGeneralComponent implements OnInit {
  student!: Student | null;
  allCourses: Course[] = [];
  coreCourses: Course[] = [];
  electiveCourses: Course[] = [];
  selectedCourses: Course[] = [];
  totalHours: number = 0;
  isDarkMode = false;

  constructor(
    private authService: AuthService, 
    private darkModeService: DarkModeService, 
    private coursesService: CoursesService,
    private toastr: ToastrService,
    private sharedHoursService: SharedHoursService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkMode();

    this.authService.studentObservable.subscribe((student) => {
      this.student = student;
    });

    this.coursesService.fetchGeneralCoreCourses().subscribe((coreCourses) => {
      this.coreCourses = coreCourses.map((course) => ({
        ...course,
        grade: course.grade || 'none'
      }));
      this.allCourses = [...this.coreCourses, ...this.electiveCourses];
      this.updateTotalHours();
    });

    this.coursesService.fetchGeneralElectiveCourses().subscribe((electiveCourses) => {
      this.electiveCourses = electiveCourses.map((course) => ({
        ...course,
        grade: course.grade || 'none'
      }));
      this.allCourses = [...this.coreCourses, ...this.electiveCourses];
      this.updateTotalHours();
    });
  }

  canTakeCourse(course: Course): boolean {
    // Course is not available if already completed
    if (course.grade && course.grade !== 'none') return false;
    
    // Check prerequisites
    if (!course.prerequest) return true;
    const preRequestCourse = this.allCourses.find(c => c.code === course.prerequest);
    return preRequestCourse?.grade !== 'none' && preRequestCourse?.grade !== 'F';
  }

  calculateTotalHours(): number {
    return [...this.coreCourses, ...this.electiveCourses]
      .filter((course) => course.grade !== 'none' && course.grade !== 'F') 
      .reduce((total, course) => total + (parseFloat(course.hours) || 0), 0); 
  }

  updateTotalHours(): void {
    this.totalHours = this.calculateTotalHours();
    this.sharedHoursService.updateGeneralHours(this.totalHours);
  }

 // Add this property to your component class
addingCourses: Set<string> = new Set(); // Track courses being added

addCourse(course: Course): void {
  if (!course.grade || course.grade === 'none') {
    this.toastr.warning('Please select a grade before adding the course');
    return;
  }

  if (!this.canTakeCourse(course)) {
    this.toastr.error('You cannot add this course due to unmet prerequisites');
    return;
  }

  // Mark as adding
  this.addingCourses.add(course.code);

  const updateCourse: UpdateCourse = {
    code: course.code,
    grade: course.grade,
    hours: parseInt(course.hours)
  };

  this.coursesService.updateCourses([updateCourse]).subscribe({
    next: (response) => {
      this.addingCourses.delete(course.code);
      
      if (response?.message === "Updated Successfully.") {
        this.toastr.success(`Course ${course.course_Name} added successfully`);
        // Now it will be disabled because canTakeCourse will return false
        this.updateTotalHours();
        this.refreshCourses();
      } else {
        this.toastr.warning(`Course update completed but verify data`);
      }
    },
    error: (error) => {
      this.addingCourses.delete(course.code);
      this.toastr.error(`Failed to add course ${course.course_Name}`);
    }
  });
}

  private refreshCourses(): void {
    // Re-fetch courses to ensure UI is in sync with backend
    this.coursesService.fetchGeneralCoreCourses().subscribe((coreCourses) => {
      this.coreCourses = coreCourses.map((course) => ({
        ...course,
        grade: course.grade || 'none'
      }));
      this.allCourses = [...this.coreCourses, ...this.electiveCourses];
    });

    this.coursesService.fetchGeneralElectiveCourses().subscribe((electiveCourses) => {
      this.electiveCourses = electiveCourses.map((course) => ({
        ...course,
        grade: course.grade || 'none'
      }));
      this.allCourses = [...this.coreCourses, ...this.electiveCourses];
    });
  }

  shouldDisableGradeSelect(course: Course): boolean {
    // Only disable if prerequisites aren't met
    return !this.canTakeCourse(course);
  }

}