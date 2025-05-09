import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { Course } from "../shared/interfaces/Course";
import { UpdateCourse } from "../shared/interfaces/UpdateCourse";
import {
  ADD_COURSE_TO_STUDENT_URL,
    GET_AI_CORE_COURSE_URL,
    GET_AI_ELECTIVE_COURSE_URL,
    GET_CS_CORE_COURSE_URL,
    GET_CS_ELECTIVE_COURSE_URL,
    GET_F_CORE_COURSE_URL,
    GET_F_ELECTIVE_COURSE_URL,
    GET_G_CORE_COURSE_URL,
    GET_G_ELECTIVE_COURSE_URL,
    GET_IS_CORE_COURSE_URL,
    GET_IS_ELECTIVE_COURSE_URL,
    GET_IT_CORE_COURSE_URL,
    GET_IT_ELECTIVE_COURSE_URL,
    GET_TOTAL_HOURS_URL,
    MAKE_COURSES_URL,
    UPDATE_COURSES_URL,
    UPDATE_DEPARTMENT_URL} from "../shared/constants/urls";
import { TotalHoursResponse } from "../shared/interfaces/hours";





@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private coursesSubject = new BehaviorSubject<Course[]>([]);

    public coursesObservable = this.coursesSubject.asObservable();

    constructor(private http: HttpClient, private toastrService: ToastrService) {}



    fetchCourses(url: string): Observable<Course[]> {
        return this.http.get<{ data: Course[] }>(url).pipe(
            map((response) => response.data),
            tap({
                next: (courses) => {
                    this.coursesSubject.next(courses);
                    // this.toastrService.success('Courses loaded successfully.');
                },
                error: () => {
                    // this.toastrService.error('Failed to load courses.');
                }
            })
        );
    }

    fetchGeneralCoreCourses(): Observable<Course[]> {
        return this.fetchCourses(GET_G_CORE_COURSE_URL);
    }

    fetchGeneralElectiveCourses(): Observable<Course[]> {
        return this.fetchCourses(GET_G_ELECTIVE_COURSE_URL);
    }

    fetchFacultyCoreCourses(): Observable<Course[]> {
        return this.fetchCourses(GET_F_CORE_COURSE_URL);
    }

    fetchFacultyElectiveCourses(): Observable<Course[]> {
        return this.fetchCourses(GET_F_ELECTIVE_COURSE_URL);
    }


    fetchCoreCourses(coreType: string): Observable<Course[]> {
        let url: string;
    
        switch (coreType) {
          case 'CS Core':
            url = GET_CS_CORE_COURSE_URL;
            break;
          case 'IS Core':
            url = GET_IS_CORE_COURSE_URL;
            break;
          case 'AI Core':
            url = GET_AI_CORE_COURSE_URL;
            break;
          case 'IT Core':
            url = GET_IT_CORE_COURSE_URL;
            break;
          default:
            throw new Error('Unknown core course type');
        }
    
        return this.http.get<{ data: Course[] }>(url).pipe(
          map((response) => response.data),
          tap({
            // next: (courses) => this.toastrService.success('Core courses loaded successfully.'),
            // error: () => this.toastrService.error('Failed to load core courses.'),
          })
        );
      }
    
      fetchElectiveCourses(electiveType: string): Observable<Course[]> {
        let url: string;
    
        switch (electiveType) {
          case 'CS Elective':
            url = GET_CS_ELECTIVE_COURSE_URL;
            break;
          case 'IS Elective':
            url = GET_IS_ELECTIVE_COURSE_URL;
            break;
          case 'AI Elective':
            url = GET_AI_ELECTIVE_COURSE_URL;
            break;
          case 'IT Elective':
            url = GET_IT_ELECTIVE_COURSE_URL;
            break;
          default:
            throw new Error('Unknown elective course type');
        }
    
        return this.http.get<{ data: Course[] }>(url).pipe(
          map((response) => response.data),
          tap({
            // next: (courses) => this.toastrService.success('Elective courses loaded successfully.'),
            // error: () => this.toastrService.error('Failed to load elective courses.'),
          })
        );
      }




      updateCourse(updateCourse: UpdateCourse): Observable<any> {
        if (!updateCourse) {
            this.toastrService.warning('No course provided for update');
            return throwError(() => new Error('No course provided for update'));
        }
    
        // Validation
        const { code, grade, hours } = updateCourse;
        const validGrades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];
    
        if (!code || !grade || isNaN(hours) || !validGrades.includes(grade)) {
            console.error('Invalid course:', updateCourse);
            this.toastrService.error('Invalid course data provided');
            return throwError(() => new Error('Invalid course data provided'));
        }
    
        const requestBody = {
            code: code.trim(),
            grade: grade,
            hours: Number(hours)
        };
    
        console.log('Sending payload:', JSON.stringify(requestBody, null, 2));
    
        return this.http.post<any>(UPDATE_COURSES_URL, requestBody).pipe(
            tap({
                next: (response) => {
                    if (response?.message === "Updated Successfully.") {
                        this.toastrService.success('Course updated successfully');
                    } else {
                        console.warn('Unexpected response:', response);
                        this.toastrService.warning(response?.message || 'Update completed with warnings');
                    }
                },
                error: (error) => {
                    console.error('API Error:', error);
                    const errorMsg = error.error?.message || 'Failed to update course';
                    this.toastrService.error(errorMsg);
                }
            }),
            catchError(error => {
                console.error('API Error Details:', error);
                return throwError(() => error);
            })
        );
    }

    


    getTotalHours(): Observable<TotalHoursResponse> {
      return this.http.get(GET_TOTAL_HOURS_URL, { responseType: 'text' }).pipe(
        tap(rawResponse => console.log('Raw response:', rawResponse)),
        map(rawResponse => {
          try {
            return JSON.parse(rawResponse) as TotalHoursResponse;
          } catch (e) {
            throw new Error('Invalid JSON response');
          }
        }),
        catchError(error => {
          console.log('Parsing error:', error);
          return throwError(() => error);
        })
      );
    }


    updateDepartment(departmentName: string): Observable<any> {
      if (!['CS', 'IS', 'AI', 'IT'].includes(departmentName)) {
        this.toastrService.error('Invalid department selected');
        return throwError(() => new Error('Invalid department selected'));
      }
    
      return this.http.post<any>(UPDATE_DEPARTMENT_URL, { departmentName }).pipe(
        tap({
          next: () => {
            this.toastrService.success('Department updated successfully');
            // Store the department in localStorage
            localStorage.setItem('selectedDepartment', departmentName);
          },
          error: (error) => {
            this.toastrService.error('Failed to update department');
            console.error('Error updating department:', error);
          }
        }),
        catchError(error => {
          console.error('API Error:', error);
          return throwError(() => error);
        })
      );
    }
      

}