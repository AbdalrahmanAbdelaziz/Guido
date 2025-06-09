import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; 
import { Observable, of, throwError } from 'rxjs'; 
import { map, catchError } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class ChatpdfService {
  private apiUrl = "https://eduguideai.runasp.net/api";
  private currentChatId: number | null = null; 

  constructor(private http: HttpClient) { }

  startNewPdfChat(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    return this.http.post(`${this.apiUrl}/Chat-PDF/NewChat`, {}, { headers });
  }

  uploadPdf(file: File, chatId: number): Observable<string> {
    if (!this.currentChatId && chatId) {
      this.currentChatId = chatId;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(
      `${this.apiUrl}/Upload-PDF?chatid=${chatId}`,
      formData,
      {
        responseType: 'text' 
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error uploading PDF:', error);
        return throwError(() => new Error('Failed to upload PDF'));
      })
    );
  }

  // Helper method to get the current chat ID
  getCurrentChatId(): number | null {
    return this.currentChatId;
  }

  // Helper method to set the current chat ID
  setCurrentChatId(id: number): void {
    this.currentChatId = id;
  }
}