import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SlidehtmlService } from '../../../services/services/slidehtml/slidehtml.service';

@Component({
  selector: 'app-slidehtml',
  templateUrl: './slidehtml.component.html',
  styleUrl: './slidehtml.component.css'
})
export class SlidehtmlComponent implements OnInit {
  slides: { id?: number; html: SafeHtml }[] = [];
  newHtmlContent: string = "";

  constructor(private slideService: SlidehtmlService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadSlides();
  }

  loadSlides() {
    this.slideService.getSlides().subscribe(data => {
      this.slides = data.map(slide => ({
        id: slide.id,
        html: this.sanitizer.bypassSecurityTrustHtml(slide.htmlContent)
      }));
    });
  }

  addSlide() {
    if (this.newHtmlContent.trim() === "") return;
    this.slideService.addSlide({ htmlContent: this.newHtmlContent }).subscribe(() => {
      this.newHtmlContent = "";
      this.loadSlides();
    });
  }
}
