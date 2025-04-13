import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../shared/interfaces/Course';
import { Student } from '../../shared/interfaces/Student';
import { UpdateCourse } from '../../shared/interfaces/UpdateCourse';
import { trigger, transition, style, animate } from '@angular/animations';
import { DarkModeService } from '../../services/dark-mode.service';
import { CoursesService } from '../../services/courses.service';

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

  constructor(private authService: AuthService, private darkModeService: DarkModeService, private coursesService: CoursesService) {}

  ngOnInit(): void {

    this.isDarkMode = this.darkModeService.isDarkMode(); // Check dark mode state

    this.authService.studentObservable.subscribe((student) => {
      this.student = student;
    });

    this.coursesService.fetchGeneralCoreCourses().subscribe((coreCourses) => {
      this.coreCourses = coreCourses.map((course) => ({
        ...course,
        grade: course.grade || 'none'
      }));
    });

    this.coursesService.fetchGeneralElectiveCourses().subscribe((electiveCourses) => {
      this.electiveCourses = electiveCourses.map((course) => ({
        ...course,
        grade: course.grade || 'none'
      }));
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

  submitCourses(): void {
    const updatedCourses: UpdateCourse[] = [...this.coreCourses, ...this.electiveCourses].map((course) => ({
      code: course.code,
      grade: course.grade || 'none',
      hours: parseFloat(course.hours),

    }));

    this.coursesService.updateCourses(updatedCourses).subscribe(() => {
      const totalHours = this.calculateTotalHours();
      this.calculatedHoursEvent.emit(totalHours);
    });
  }
}