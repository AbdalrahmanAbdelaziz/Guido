import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../shared/interfaces/Course';
import { UpdateCourse } from '../../shared/interfaces/UpdateCourse';
import { Student } from '../../shared/interfaces/Student';
import { DarkModeService } from '../../services/dark-mode.service';
import { CoursesService } from '../../services/courses.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-faculty',
  templateUrl: './my-faculty.component.html',
  styleUrls: ['./my-faculty.component.css']
})
export class MyFacultyComponent implements OnInit {

  student!: Student;
  allCourses: Course[] = [];
  coreCourses: Course[] = [];
  electiveCourses: Course[] = [];
  facultyHours: number = 0;
  isDarkMode = false;
  disabledCourses: string[] = [];
  showAddButtonMap: { [courseCode: string]: boolean } = {};


  @Output() calculatedHoursEvent = new EventEmitter<number>();

  constructor(private authService: AuthService, private darkModeService: DarkModeService, private coursesService: CoursesService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkMode(); // Check dark mode state

    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });

    this.coursesService.fetchFacultyCoreCourses().subscribe((coreCourses) => {
        this.coreCourses = coreCourses.map((course) => {
            this.showAddButtonMap[course.code] = !course.grade || course.grade === 'none';
            return {
              ...course,
              grade: course.grade || 'none'
            };
          });
          this.allCourses = [...this.coreCourses, ...this.electiveCourses];
        });

    this.coursesService.fetchFacultyElectiveCourses().subscribe((electiveCourses) => {
        this.electiveCourses = electiveCourses.map((course) => {
            this.showAddButtonMap[course.code] = !course.grade || course.grade === 'none';
            return {
              ...course,
              grade: course.grade || 'none'
            };
          });
          this.allCourses = [...this.coreCourses, ...this.electiveCourses];
        });
  }

  canTakeCourse(course: Course): boolean {
    if (!course.prerequest) return true;
    const preRequestCourse = this.allCourses.find((c) => c.code === course.prerequest);
    return preRequestCourse?.grade !== 'none' && preRequestCourse?.grade !== 'F';
  }

  calculateFacultyHours(): number {
    return [...this.coreCourses, ...this.electiveCourses]
      .filter((course) => course.grade !== 'none' && course.grade !== 'F')
      .reduce((total, course) => total + (parseFloat(course.hours) || 0), 0); 
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

    // Hide the add button immediately
    this.showAddButtonMap[course.code] = false;

    const updateCourse: UpdateCourse = {
      code: course.code,
      grade: course.grade,
      hours: parseInt(course.hours)
    };

    this.coursesService.updateCourse(updateCourse).subscribe({
      next: (response) => {
        if (response && response.message === "Updated Successfully.") {
          // this.toastr.success(`Course ${course.course_Name} added successfully`);
        } else {
          // Show the add button again if not successful
          this.showAddButtonMap[course.code] = true;
          this.toastr.warning(`Course update completed but verify data for ${course.course_Name}`);
        }
      },
      error: (error) => {
        // Show the add button again on error
        this.showAddButtonMap[course.code] = true;
        this.toastr.error(`Failed to add course ${course.course_Name}`);
      }
    });
  }

  isCourseDisabled(course: Course): boolean {
    return this.disabledCourses.includes(course.code);
  }
}
