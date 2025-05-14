import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { StudentHeaderComponent } from '../student-header/student-header.component';
import { Student } from '../../shared/DTOs/Student';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-page',
  standalone: true,
  imports: [ 
    CommonModule, 
    RouterModule, 
    FormsModule,
    TranslocoModule,
    StudentHeaderComponent
  ],
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.css']
})
export class StudentPageComponent implements OnInit {
  student!: Student;
  currentLang: string;
  
  features = [
    {
      nameKey: 'student.features.lexi.name',
      captionKey: 'student.features.lexi.caption',
      image: 'assets/chatbot.jpg',
      link: '/chatbot',
    },
    {
      nameKey: 'student.features.courses.name',
      captionKey: 'student.features.courses.caption',
      image: 'assets/about.jpg',
      link: '/my-courses',
    },
    {
      nameKey: 'student.features.transcript.name',
      captionKey: 'student.features.transcript.caption',
      image: 'assets/t.jpg',
      link: '/transcript',
    },
    {
      nameKey: 'student.features.roadmap.name',
      captionKey: 'student.features.roadmap.caption',
      image: 'assets/v.jpg',
      link: '/roadmap',
    },
    {
      nameKey: 'student.features.internships.name',
      captionKey: 'student.features.internships.caption',
      image: 'assets/i.webp',
      link: '/intership',
    },
    {
      nameKey: 'student.features.stress.name',
      captionKey: 'student.features.stress.caption',
      image: 'assets/st.jpg',
      link: '/stress',
    },
  ];

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private translocoService: TranslocoService
  ) {
    this.currentLang = this.translocoService.getActiveLang();
    this.authService.studentObservable.subscribe((newStudent) => {
      if (newStudent) {
        this.student = newStudent;
      }
    });
  }

  ngOnInit(): void {}

  navigateTo(link: string) {
    this.router.navigate([link]);
  }
}