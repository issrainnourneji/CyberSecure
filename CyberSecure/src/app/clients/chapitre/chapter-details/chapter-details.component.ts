import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { SlideService } from '../../../services/services/slide/slide.service';

@Component({
  selector: 'app-chapter-details',
  templateUrl: './chapter-details.component.html',
  styleUrl: './chapter-details.component.css'
})
export class ChapterDetailsComponent implements OnInit {
  slides: any[] = [];
  chapitreId: number = 0;
  chapitreTitre = '';
  currentIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private slideService: SlideService
  ) {}

  ngOnInit(): void {
    this.chapitreId = Number(this.route.snapshot.paramMap.get('id'));

    // Charger les slides pour ce chapitre
    this.slideService.getSlides(this.chapitreId).subscribe({
      next: (data) => {
        this.slides = data;
        if (this.slides.length > 0) {
          this.chapitreTitre = this.slides[0].chapitre?.titre || '';
        }
        if (this.slides.length === 0) {
      this.goToQuiz();
    }
      },
      error: (err) => console.error('Erreur chargement slides', err)
    });
  }

  nextSlide() {
    if (this.currentIndex < this.slides.length - 1) this.currentIndex++;
  }

  prevSlide() {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  goToQuiz() {
    this.router.navigate(['/mainUser/quiz', this.chapitreId]);
  }

  getEmbedUrl(url: string): string {
    if (!url) return '';
    let videoId = '';

    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = url.match(regExp);
    if (match && match[1]) {
      videoId = match[1];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
}
