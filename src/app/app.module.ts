import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandComponent } from './pages/land/land.component';
import { InfoComponent } from './pages/info/info.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FooterComponent } from './pages/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RegisterStudentComponent } from './pages/register-student/register-student.component';
import { RegisterAdminComponent } from './pages/register-admin/register-admin.component';
import { StudentPageComponent } from './pages/student-page/student-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { MyGeneralComponent } from './pages/my-general/my-general.component';
import { MyFacultyComponent } from './pages/my-faculty/my-faculty.component';
import { MyDepartmentComponent } from './pages/my-department/my-department.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranscriptComponent } from './pages/transcript/transcript.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth/AuthInterceptor';
import { SideNavbarComponent } from './pages/side-navbar/side-navbar.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StudentHeaderComponent } from './pages/student-header/student-header.component';
import { TranslocoRootModule } from './transloco-root.module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    LandComponent,
    InfoComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    RegisterStudentComponent,
    RegisterAdminComponent,
    StudentPageComponent,
    AdminPageComponent,
    ProfileComponent,
    MyCoursesComponent,
    MyGeneralComponent,
    MyFacultyComponent,
    MyDepartmentComponent,
    TranscriptComponent,
    SideNavbarComponent,
    StudentHeaderComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    CommonModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right', 
      newestOnTop: false,
    }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
      TranslocoRootModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
