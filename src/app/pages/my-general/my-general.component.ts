import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../shared/interfaces/Course';
import { Student } from '../../shared/interfaces/Student';
import { DarkModeService } from '../../services/dark-mode.service';
import { CoursesService } from '../../services/courses.service';
import { ToastrService } from 'ngx-toastr';

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

  @Output() calculatedHoursEvent = new EventEmitter<number>();

  constructor(
    private authService: AuthService, 
    private darkModeService: DarkModeService, 
    private coursesService: CoursesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkMode();

    this.authService.studentObservable.subscribe((student) => {
      this.student = student;
    });

    this.coursesService.fetchGeneralCoreCourses().subscribe((coreCourses) => {
      this.coreCourses = coreCourses;
    });

    this.coursesService.fetchGeneralElectiveCourses().subscribe((electiveCourses) => {
      this.electiveCourses = electiveCourses;
    });
  }

  canTakeCourse(course: Course): boolean {
    if (!course.prerequest) return true;
    const preRequestCourse = this.allCourses.find((c) => c.code === course.prerequest);
    return preRequestCourse?.grade !== 'none' && preRequestCourse?.grade !== 'F';
  }

  calculateTotalHours(): number {
    return this.selectedCourses.reduce((total, course) => {
      const hours = parseFloat(course.hours) || 0;
      return total + hours;
    }, 0);
  }

  addCourse(courseCode: string): void {
    this.coursesService.addCourseToStudent(courseCode).subscribe({
      next: () => {
        const course = [...this.coreCourses, ...this.electiveCourses].find(c => c.code === courseCode);
        if (course) {
          this.selectedCourses.push(course);
          this.toastr.success(`Course ${courseCode} added successfully`);
          this.calculatedHoursEvent.emit(this.calculateTotalHours());
        }
      },
      error: (err) => {
        this.toastr.error(`Failed to add course: ${err.message}`);
      }
    });
  }
}