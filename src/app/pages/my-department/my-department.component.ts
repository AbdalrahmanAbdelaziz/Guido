import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../shared/interfaces/Course';
import { UpdateCourse } from '../../shared/interfaces/UpdateCourse';
import { Student } from '../../shared/interfaces/Student';
import { DarkModeService } from '../../services/dark-mode.service';
import { CoursesService } from '../../services/courses.service';
import { ToastrService } from 'ngx-toastr';

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
  allCourses: Course[] = [];
  disabledCourses: string[] = [];
  showAddButtonMap: { [courseCode: string]: boolean } = {};

  @Output() calculatedHoursEvent = new EventEmitter<number>();

  isModalVisible = false; // Changed to false initially

  constructor(
    private authService: AuthService, 
    private darkModeService: DarkModeService, 
    private coursesService: CoursesService, 
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkMode();

    // Check if department is already selected
    const savedDepartment = localStorage.getItem('selectedDepartment');
    if (savedDepartment) {
      this.selectedDepartment = savedDepartment;
      this.fetchDepartmentCourses();
    } else {
      this.isModalVisible = true; // Show modal only if no department is selected
    }

    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }

  onDepartmentChange(event: any): void {
    this.selectedDepartment = event.target.value;
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

  confirmDepartment(): void {
    if (!this.selectedDepartment) {
      this.toastr.warning('Please select a department');
      return;
    }

    this.coursesService.updateDepartment(this.selectedDepartment).subscribe({
      next: () => {
        this.isModalVisible = false;
        this.fetchDepartmentCourses();
      },
      error: (error) => {
        console.error('Error updating department:', error);
      }
    });
  }

  private fetchCoursesByType(coreType: string, electiveType: string): void {
    this.coreCourses = [];
    this.electiveCourses = [];
    this.allCourses = [];
    this.showAddButtonMap = {};
  
    this.coursesService.fetchCoreCourses(coreType).subscribe({
      next: (coreCourses) => {
        this.coreCourses = coreCourses.map((course) => {
          const grade = course.grade || 'none';
          this.showAddButtonMap[course.code] = grade === 'none';
          return {
            ...course,
            grade,
          };
        });
        this.allCourses = [...this.coreCourses, ...this.electiveCourses];
      },
      error: () => {
        console.error(`Failed to fetch ${coreType} courses`);
      },
    });
  
    this.coursesService.fetchElectiveCourses(electiveType).subscribe({
      next: (electiveCourses) => {
        this.electiveCourses = electiveCourses.map((course) => {
          const grade = course.grade || 'none';
          this.showAddButtonMap[course.code] = grade === 'none';
          return {
            ...course,
            grade,
          };
        });
        this.allCourses = [...this.coreCourses, ...this.electiveCourses];
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

  closeModal(): void {
    if (!this.selectedDepartment) {
      this.toastr.warning('Please select a department');
      return;
    }
    this.confirmDepartment();
  }

  addCourse(course: Course): void {
    if (!course.grade || course.grade === 'none') {
      this.toastr.warning('Please select a grade before adding the course');
      return;
    }

    if (!this.canTakeCourse(course)) {
      this.toastr.error('You cannot add this course due to unmet prerequisites');
      return;
    }

    if (!course.code) {
      this.toastr.error('Course code is missing');
      return;
    }

    this.showAddButtonMap[course.code] = false;

    const updateCourse: UpdateCourse = {
      code: course.code,
      grade: course.grade,
      hours: parseInt(course.hours)
    };

    this.coursesService.updateCourses([updateCourse]).subscribe({
      next: (response) => {
        if (response && response.message === "Updated Successfully.") {
          this.toastr.success(`Course ${course.course_Name} added successfully`);
        } else {
          this.showAddButtonMap[course.code] = true;
          this.toastr.warning(`Course update completed but verify data for ${course.course_Name}`);
        }
      },
      error: (error) => {
        this.showAddButtonMap[course.code] = true;
        this.toastr.error(`Failed to add course ${course.course_Name}`);
      }
    });
  }

  isCourseDisabled(course: Course): boolean {
    return this.disabledCourses.includes(course.code);
  }
}