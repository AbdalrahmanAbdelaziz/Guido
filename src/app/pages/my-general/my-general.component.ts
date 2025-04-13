import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Course, CourseWithStatus } from '../../shared/interfaces/Course';
import { Student } from '../../shared/interfaces/Student';
import { DarkModeService } from '../../services/dark-mode.service';
import { CoursesService } from '../../services/courses.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-general',
  templateUrl: './my-general.component.html',
  styleUrls: ['./my-general.component.css']
})
export class MyGeneralComponent implements OnInit {
  student!: Student | null;
  coreCourses: CourseWithStatus[] = [];
  electiveCourses: CourseWithStatus[] = [];
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

    this.loadCourses();
  }

  loadCourses(): void {
    this.coursesService.fetchGeneralCoreCourses().subscribe((coreCourses) => {
      this.coreCourses = coreCourses.map(course => ({
        ...course,
        isAdded: false
      }));
    });

    this.coursesService.fetchGeneralElectiveCourses().subscribe((electiveCourses) => {
      this.electiveCourses = electiveCourses.map(course => ({
        ...course,
        isAdded: false
      }));
    });
  }

  canTakeCourse(course: CourseWithStatus): boolean {
    if (!course.prerequest) return true;
    const preRequestCourse = [...this.coreCourses, ...this.electiveCourses]
      .find(c => c.code === course.prerequest);
    return preRequestCourse?.isAdded || false;
  }

  calculateTotalHours(): number {
    return [...this.coreCourses, ...this.electiveCourses]
      .filter(course => course.isAdded)
      .reduce((total, course) => total + (parseFloat(course.hours) || 0), 0);
  }

  addCourse(course: CourseWithStatus): void {
    this.coursesService.addCourseToStudent(course.code).subscribe({
      next: () => {
        course.isAdded = true;
        this.toastr.success(`${course.course_Name} added successfully`);
        this.totalHours = this.calculateTotalHours();
        this.calculatedHoursEvent.emit(this.totalHours);
      },
      error: (err) => {
        this.toastr.error(`Failed to add ${course.course_Name}`);
        console.error('Error adding course:', err);
      }
    });
  }
}