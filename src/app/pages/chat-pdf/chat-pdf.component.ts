import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { StudentHeaderComponent } from '../student-header/student-header.component';
import { Student } from '../../shared/DTOs/Student';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatpdfService } from '../../services/chatpdf.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-chat-pdf',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    StudentHeaderComponent,
  ],
  templateUrl: './chat-pdf.component.html',
  styleUrls: ['./chat-pdf.component.css']
})
export class ChatPdfComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  student: Student | null = null;
  currentLang: string;
  isDarkMode: boolean = false;
  selectedFile: File | null = null;
  fileName: string = '';
  isLoading: boolean = false;
  uploadSuccess: boolean = false;
  errorMessage: string = '';
  chatId: number | null = null;
  isNewChat: boolean = false;

  constructor(
    private authService: AuthService,
    private translocoService: TranslocoService,
    private chatpdfService: ChatpdfService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentLang = this.translocoService.getActiveLang();
    this.authService.studentObservable.subscribe((newStudent: Student | null) => {
      this.student = newStudent;
    });

    this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this.isDarkMode = event.matches;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.chatId = params['chatId'] ? Number(params['chatId']) : null;
      if (!this.chatId) {
        this.errorMessage = 'No chat ID provided in URL';
      }
    });

    // Check if this is a new chat session
    const navigation = this.router.getCurrentNavigation();
    this.isNewChat = navigation?.extras?.state?.['isNewChat'] || false;
    
    if (this.isNewChat) {
      // You might want to show a welcome message or specific UI for new chats
      console.log('New PDF chat session created');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (file.type !== 'application/pdf') {
        this.errorMessage = 'Please select a PDF file';
        return;
      }

      // Validate file size (e.g., 10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'File size should not exceed 10MB';
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name;
      this.uploadSuccess = false;
      this.errorMessage = '';
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first';
      return;
    }

    if (!this.chatId) {
      this.errorMessage = 'No chat session available';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.chatpdfService.uploadPdf(this.selectedFile, this.chatId)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response: string) => {
          this.uploadSuccess = true;
          this.fileName = response;
          setTimeout(() => this.uploadSuccess = false, 3000);
          
          // Optionally navigate to chat interface after successful upload
          // this.router.navigate(['/pdf-chat'], { queryParams: { chatId: this.chatId } });
        },
        error: (err: Error) => {
          this.errorMessage = err.message || 'Failed to upload PDF';
          console.error('Upload error:', err);
        }
      });
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
}