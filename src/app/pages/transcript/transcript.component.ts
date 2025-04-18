import { Component, OnInit } from '@angular/core';
import { Student } from '../../shared/interfaces/Student';
import { AuthService } from '../../services/auth.service';
import { DarkModeService } from '../../services/dark-mode.service';

@Component({
  selector: 'app-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.css']
})
export class TranscriptComponent implements OnInit {
  student!: Student | null;
  isDarkMode = false;
  transcriptData: any = null;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit(): void {
    this.isDarkMode = this.darkModeService.isDarkMode();
    this.loadStudentData();
    this.loadTranscriptData();
  }

  loadStudentData(): void {
    this.authService.studentObservable.subscribe((student) => {
      this.student = student;
    });
  }

  loadTranscriptData(): void {
    this.isLoading = true;
    this.authService.getTranscript().subscribe({
      next: (data) => {
        this.transcriptData = data;
        this.updateStudentWithTranscript(data);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  updateStudentWithTranscript(data: any): void {
    if (this.student) {
      this.student = {
        ...this.student,
        gpa: data.gpa,
        completedHours: data.totalHours,
        department: data.department
      };
    }
  }

  getCumulativeGrade(): string {
    if (this.transcriptData?.totalGpa) {
      return this.transcriptData.totalGpa;
    }

    const gpa = this.student?.gpa || this.transcriptData?.gpa;
    if (gpa !== undefined) {
      if (gpa >= 3.4) return 'Excellent';
      else if (gpa >= 2.8) return 'Very Good';
      else if (gpa >= 2.4) return 'Good';
      else if (gpa >= 2) return 'Acceptable';
      else if (gpa >= 1.4) return 'Weak';
      else if (gpa < 1.4) return 'Very Weak';
    }
    return 'N/A';
  }
}