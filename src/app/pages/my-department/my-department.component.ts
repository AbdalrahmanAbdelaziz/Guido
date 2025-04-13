import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../shared/interfaces/Course';
import { UpdateCourse } from '../../shared/interfaces/UpdateCourse';
import { Student } from '../../shared/interfaces/Student';
import { DarkModeService } from '../../services/dark-mode.service';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-my-department',
  templateUrl: './my-department.component.html',
  styleUrls: ['./my-department.component.css']
})
export class MyDepartmentComponent implements OnInit {
  student!: Student;
  coreCourses: Course[] = [];
  electiveCourses: Course[] = [];
  selectedDepartment: string | null = null;
  departmentHours: number = 0;
  isDarkMode = false;


  @Output() calculatedHoursEvent = new EventEmitter<number>();

  isModalVisible = true;  
  constructor(private authService: AuthService, private darkModeService: DarkModeService, private coursesService: CoursesService) {}

  ngOnInit(): void {

    this.isDarkMode = this.darkModeService.isDarkMode(); // Check dark mode state

    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }

  onDepartmentChange(event: any): void {
    this.selectedDepartment = event.target.value;
    this.fetchDepartmentCourses();
  }

  fetchDepartmentCourses(): void {
    if (!this.selectedDepartment) return;

    switch (this.selectedDepartment) {
      case 'CS':
        this.fetchCoursesByType('CS Core', 'CS Elective');
        break;
      case 'IS':
        this.fetchCoursesByType('IS Core', 'IS Elective');
        break;
      case 'AI':
        this.fetchCoursesByType('AI Core', 'AI Elective');
        break;
      case 'IT':
        this.fetchCoursesByType('IT Core', 'IT Elective');
        break;
      default:
        console.error('Invalid department selected');
        return;
    }
  }

  private fetchCoursesByType(coreType: string, electiveType: string): void {
    this.coreCourses = [];
    this.electiveCourses = [];

    this.coursesService.fetchCoreCourses(coreType).subscribe({
      next: (coreCourses) => {
        this.coreCourses = coreCourses.map((course) => ({
          ...course,
          grade: course.grade || 'none',
        }));
      },
      error: () => {
        console.error(`Failed to fetch ${coreType} courses`);
      },
    });

    this.coursesService.fetchElectiveCourses(electiveType).subscribe({
      next: (electiveCourses) => {
        this.electiveCourses = electiveCourses.map((course) => ({
          ...course,
          grade: course.grade || 'none',
        }));
      },
      error: () => {
        console.error(`Failed to fetch ${electiveType} courses`);
      },
    });
  }

  canTakeCourse(course: Course): boolean {
    if (!course.prerequest) return true;
    const preRequestCourse = this.coreCourses.concat(this.electiveCourses).find((c) => c.code === course.prerequest);
    return preRequestCourse?.grade !== 'none' && preRequestCourse?.grade !== 'F';
  }

  calculateDepartmentHours(): number {
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
      const departmentHours = this.calculateDepartmentHours();
      this.calculatedHoursEvent.emit(departmentHours); 
    });
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
