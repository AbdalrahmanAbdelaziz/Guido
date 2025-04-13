import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../shared/interfaces/Student';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.css'],
})
export class StudentPageComponent implements OnInit {
  student!: Student;
  features = [
    {
      name: 'Talk To Lexi',
      caption: 'Lexi: Your intelligent assistant, always here to help.',
      image: 'chatbot.jpg',
      link: '/chatbot',
    },
    {
      name: 'My Courses',
      caption: 'Your path to knowledge begins right here with us.',
      image: 'about.jpg',
      link: '/my-courses',
    },
    {
      name: 'Transcript',
      caption: 'A snapshot of your progress and great achievements.',
      image: 't.jpg',
      link: '/transcript',
    },
    {
      name: 'Interactive Roadmap',
      caption: 'Monitor your progress and stay on track effortlessly.',
      image: 'v.jpg',
      link: '/roadmap',
    },
    {
      name: 'Search For Internships',
      caption: 'Explore new opportunities, gain experience, and build.',
      image: 'i.webp',
      link: '/intership',
    },
    {
      name: 'Stress Management',
      caption: 'Your guide to finding peace amidst the chaos.',
      image: 'st.jpg',
      link: '/stress',
    },
  ];

  constructor(private authService: AuthService, private router: Router) {
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
