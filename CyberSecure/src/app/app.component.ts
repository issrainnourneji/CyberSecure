import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

   constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('lang') || 'fr';
    translate.use(savedLang);
  }
  title = 'MuntuCybersecure';
  get isComingSoon(): boolean {
    return environment.comingSoon && !environment.developerMode;
  }}
