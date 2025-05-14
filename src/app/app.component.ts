import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  currentLang: string;
  title = 'Guido';

  constructor(private translocoService: TranslocoService) {
    // Initialize with saved language or default
    this.currentLang = localStorage.getItem('language') || 'en';
    this.translocoService.setActiveLang(this.currentLang);
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  switchLanguage(lang: string) {
  this.currentLang = lang;
  this.translocoService.setActiveLang(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('language', lang);
}
}
