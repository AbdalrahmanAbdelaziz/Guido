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
    MAKE_COURSES_URL,
    UPDATE_COURSES_URL} from "../shared/constants/urls";





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




      updateCourses(updateCourses: UpdateCourse[]): Observable<any> {
        if (!updateCourses || updateCourses.length === 0) {
          this.toastrService.warning('No courses provided for update');
          return throwError(() => new Error('No courses provided for update'));
        }
    
        const invalidCourses = updateCourses.filter(c => 
          !c.code || !c.grade || isNaN(c.hours)
        );
        
        if (invalidCourses.length > 0) {
          this.toastrService.error('Invalid course data provided');
          return throwError(() => new Error('Invalid course data provided'));
        }
    
        return this.http.post<any>(UPDATE_COURSES_URL, updateCourses).pipe(
          tap({
            next: (response) => {
              if (response && response.message === "Updated Successfully.") {
                this.toastrService.success('Courses updated successfully');
              } else {
                this.toastrService.warning('Courses updated with warnings');
                console.warn('Unexpected response:', response);
              }
            },
            error: (error) => {
              this.toastrService.error('Failed to update courses');
              console.error('Error:', error);
            }
          }),
          catchError(error => {
            console.error('API Error:', error);
            return throwError(() => error);
          })
        );
      }
      

}