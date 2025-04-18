import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import {
    ADMIN_REGISTER_URL,
    FORGET_PASSWORD_URL,
    LOGIN_URL,
    RESET_PASSWORD_URL,
    STUDENT_REGISTER_URL,
    UPDATE_COURSES_URL,
    UPDATE_PASSWORD_URL,
    UPDATE_PROFILE_URL,
} from "../shared/constants/urls";

import { UserLogin } from "../shared/interfaces/UserLogin";
import { Student } from "../shared/interfaces/Student";
import { Admin } from "../shared/interfaces/Admin";
import { ResetPassword } from "../shared/interfaces/ResetPassword";

const STUDENT_KEY = 'Student';
const ADMIN_KEY = 'Admin';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private studentSubject = new BehaviorSubject<Student | null>(this.getStudentFromLocalStorage());
    private adminSubject = new BehaviorSubject<Admin | null>(this.getAdminFromLocalStorage());

    public studentObservable = this.studentSubject.asObservable();
    public adminObservable = this.adminSubject.asObservable();

    constructor(private http: HttpClient, private toastrService: ToastrService) {}

    login(userLogin: UserLogin): Observable<any> {
        return this.http.post<any>(LOGIN_URL, userLogin).pipe(
            tap({
                next: (response) => {
                    if (response.data.role === 'Student') {
                        const student = response.data as Student;
                        this.setStudentToLocalStorage(student);
                        this.studentSubject.next(student);
                        this.toastrService.success(`Welcome ${student.firstName}!`);
                    } else if (response.data.role === 'Admin') {
                        const admin = response.data as Admin;
                        this.setAdminToLocalStorage(admin);
                        this.adminSubject.next(admin);
                        this.toastrService.success(`Welcome ${admin.firstName}!`);
                    }
                },
                error: () => {
                    this.toastrService.error('Login Failed');
                }
            })
        );
    }

    logout() {
        this.studentSubject.next(null);
        this.adminSubject.next(null);
        localStorage.removeItem(STUDENT_KEY);
        localStorage.removeItem(ADMIN_KEY);
    }

    registerStudent(studentRegister: Student): Observable<Student> {
        return this.http.post<Student>(STUDENT_REGISTER_URL, studentRegister).pipe(
          tap({
            next: (student) => {
              this.setStudentToLocalStorage(student);
              this.studentSubject.next(student);
              // Don't show success here - let component handle it with custom message
            },
            error: (error) => {
              this.toastrService.error(
                error.error?.message || 'Registration Failed',
                'Error',
                {
                  timeOut: 5000,
                  positionClass: 'toast-top-center'
                }
              );
            }
          })
        );
      }

    registerAdmin(adminRegister: Admin): Observable<Admin> {
        return this.http.post<Admin>(ADMIN_REGISTER_URL, adminRegister).pipe(
            tap({
                next: (admin) => {
                    this.setAdminToLocalStorage(admin);
                    this.adminSubject.next(admin);
                    this.toastrService.success('Registration Successful');
                },
                error: () => {
                    this.toastrService.error('Registration Failed');
                }
            })
        );
    }

    forgetPassword(email: string): Observable<any> {
        return this.http.post<any>(FORGET_PASSWORD_URL, { email }).pipe(
            tap({
                next: () => this.toastrService.success('Password reset link sent!'),
                error: () => this.toastrService.error('Failed to send reset link.')
            })
        );
    }

    resetPassword(payload: ResetPassword): Observable<void> {
        return this.http.post<void>(RESET_PASSWORD_URL, payload).pipe(
            tap({
                next: () => this.toastrService.success('Password reset successfully.'),
                error: () => this.toastrService.error('Failed to reset password.')
            })
        );
    }

    

  



   

    

    private setStudentToLocalStorage(student: Student) {
        localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
    }

    private getStudentFromLocalStorage(): Student | null {
        const studentJson = localStorage.getItem(STUDENT_KEY);
        return studentJson ? JSON.parse(studentJson) : null;
    }

    private setAdminToLocalStorage(admin: Admin) {
        localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    }

    private getAdminFromLocalStorage(): Admin | null {
        const adminJson = localStorage.getItem(ADMIN_KEY);
        return adminJson ? JSON.parse(adminJson) : null;
    }


    
    updatePassword(password: string, confirm: string): Observable<Student> {
        return this.http.post<Student>(UPDATE_PASSWORD_URL, { password, confirm }).pipe(
          tap({
            next: (response) => {
              // Get current student data
              const currentStudent = this.getStudentFromLocalStorage();
              
              // Create updated student object by merging current data with response
              const updatedStudent = {
                ...currentStudent,
                ...response, // This will overwrite any matching fields from response
                password: response.password, // Ensure password is updated
                token: response.token || currentStudent?.token // Preserve token if not in response
              } as Student;
              
              this.setStudentToLocalStorage(updatedStudent);
              this.studentSubject.next(updatedStudent);
              this.toastrService.success('Password updated successfully!');
            },
            error: (error) => {
              this.toastrService.error(
                error.error?.message || 'Failed to update password',
                'Error',
                {
                  timeOut: 5000,
                  positionClass: 'toast-top-center'
                }
              );
            }
          })
        );
      }

   
}
