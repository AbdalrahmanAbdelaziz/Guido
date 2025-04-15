import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandComponent } from './pages/land/land.component';
import { InfoComponent } from './pages/info/info.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RegisterStudentComponent } from './pages/register-student/register-student.component';
import { RegisterAdminComponent } from './pages/register-admin/register-admin.component';
import { StudentPageComponent } from './pages/student-page/student-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { MyGeneralComponent } from './pages/my-general/my-general.component';
import { MyFacultyComponent } from './pages/my-faculty/my-faculty.component';
import { MyDepartmentComponent } from './pages/my-department/my-department.component';
import { TranscriptComponent } from './pages/transcript/transcript.component';


const routes: Routes = [
  { path: '', component:LandComponent},
  { path: 'info', component:InfoComponent},
  { path: 'login', component:LoginComponent},
  { path: 'register', component:RegisterComponent},
  { path: 'forget-password', component: ForgetPasswordComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'registerStudent', component: RegisterStudentComponent},
  { path: 'registerAdmin', component: RegisterAdminComponent},
  { path: 'student-page', component: StudentPageComponent},
  { path: 'admin-page', component: AdminPageComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'my-courses', component: MyCoursesComponent},
  { path: 'my-general', component: MyGeneralComponent},
  { path: 'my-faculty', component: MyFacultyComponent},
  { path: 'my-department', component: MyDepartmentComponent},
  { path: 'transcript', component: TranscriptComponent},
  
  // { path: '**', redirectTo:'', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
