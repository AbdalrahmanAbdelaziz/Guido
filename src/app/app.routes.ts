import { Routes } from '@angular/router';
import { LandComponent } from './pages/land/land.component';
import { InfoComponent } from './pages/info/info.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterStudentComponent } from './pages/register-student/register-student.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { StudentPageComponent } from './pages/student-page/student-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { MyGeneralComponent } from './pages/my-general/my-general.component';
import { MyFacultyComponent } from './pages/my-faculty/my-faculty.component';
import { MyDepartmentComponent } from './pages/my-department/my-department.component';
import { TranscriptComponent } from './pages/transcript/transcript.component';
import { AdminPageComponent } from './pages/admin/admin-page/admin-page.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';

export const routes: Routes = [
    // { path: '**', redirectTo:'', pathMatch: 'full'},
    { path: '', component:LandComponent},
    { path: 'info', component:InfoComponent},
    { path: 'login', component:LoginComponent},
    { path: 'forget-password', component: ForgetPasswordComponent},
    { path: 'reset-password', component: ResetPasswordComponent},
    { path: 'registerStudent', component: RegisterStudentComponent},
    { path: 'student-page', component: StudentPageComponent},
    { path: 'profile', component: ProfileComponent},
    { path: 'my-courses', component: MyCoursesComponent},
    { path: 'my-general', component: MyGeneralComponent},
    { path: 'my-faculty', component: MyFacultyComponent},
    { path: 'my-department', component: MyDepartmentComponent},
    { path: 'transcript', component: TranscriptComponent},
    { path: 'chatbot', component: ChatbotComponent},
    { path: 'admin-page', component: AdminPageComponent},
    // { path: 'registerAdmin', component: RegisterAdminComponent},
     // { path: 'register', component:RegisterComponent},
];
