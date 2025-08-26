import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SlideService } from '../../../services/services/slide/slide.service';
import { ChapterService } from '../../../services/services/Chapiters/chapter.service';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
declare var bootstrap: any;


@Component({
  selector: 'app-list-slides',
  templateUrl: './list-slides.component.html',
  styleUrl: './list-slides.component.css'
})
export class ListSlidesComponent implements OnInit {

  slides: any[] = [];
  newSlide: any = {};
  selectedSlide: any = null;
  selectedImage: File | null = null;
  newSelectedImage: File | null = null;

  formations: any[] = [];
  chapitres: any[] = [];
  selectedFormationId: number | null = null;
  selectedChapitreId: number | null = null;

  addSlideModal : any;

  constructor(private formationService: FormationServiceService, private slideService: SlideService, private http: HttpClient, private chapitreService: ChapterService,) {}

  ngOnInit(): void {
    this.loadSlides();
    this.loadFormations();
  }

  // Charger tous les slides
  loadSlides(): void {
    this.slideService.getAllSlides().subscribe({
      next: (data) => {
        this.slides = data;
      },
      error: (err) => {
        console.error('Erreur chargement slides', err);
      }
    });

  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (response) => {
        this.formations = response;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des formations:', error);
      }
    });
  }

  ngAfterViewInit(): void {
        this.addSlideModal = new bootstrap.Modal(document.getElementById('addSlideModal'));

  }

onFormationChange() {
  if (this.selectedFormationId) {
    this.chapitreService.getChapitresByFormation(this.selectedFormationId).subscribe({
      next: data => this.chapitres = data,
      error: err => console.error('Erreur chargement chapitres', err)
    });
  } else {
    this.chapitres = [];
  }
}

  // --- AJOUTER SLIDE ---
  openAddSlideModal(): void {
    this.newSlide = {};
    this.newSelectedImage = null;
    const modal = document.getElementById('addSlideModal');
    if (modal) {
this.addSlideModal = new bootstrap.Modal(modal);
this.addSlideModal.show();
    }
  }


  onNewImageSelected(event: any): void {
    this.newSelectedImage = event.target.files[0];
  }

 onSubmitAddSlide(): void {
  if (!this.selectedChapitreId) {
    alert("Veuillez sélectionner un chapitre !");
    return;
  }

  const formData = new FormData();

  Object.keys(this.newSlide).forEach(key => {
    if (this.newSlide[key] !== undefined && this.newSlide[key] !== null) {
      formData.append(key, this.newSlide[key]);
    }
  });

  if (this.newSelectedImage) {
    formData.append('image', this.newSelectedImage);
  }

  // Utiliser le chapitre sélectionné
  this.slideService.addSlide(this.selectedChapitreId, formData).subscribe({
    next: () => {
      this.loadSlides();
      this.addSlideModal.hide(); // fermer le modal
    },
    error: err => console.error('Erreur ajout slide', err)
  });
}

  // --- MODIFIER SLIDE ---
  editSlide(slide: any): void {
    this.selectedSlide = { ...slide };
    this.selectedImage = null;
    const modal = document.getElementById('editSlideModal');
    if (modal) {
this.addSlideModal = new bootstrap.Modal(modal);
this.addSlideModal.show();    }
  }

  onImageSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  onSubmitEditSlide(): void {
    if (!this.selectedSlide) return;

    const formData = new FormData();
    Object.keys(this.selectedSlide).forEach(key => {
      if (this.selectedSlide[key] !== undefined && this.selectedSlide[key] !== null) {
        formData.append(key, this.selectedSlide[key]);
      }
    });

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.http.put(`http://localhost:8080/slide/${this.selectedSlide.id}`, formData).subscribe({
      next: () => {
        this.loadSlides();
        const modal = document.getElementById('editSlideModal');
        if (modal) {
this.addSlideModal = new bootstrap.Modal(modal);
this.addSlideModal.show();        }
      },
      error: (err) => console.error('Erreur update slide', err)
    });
  }

  // --- SUPPRIMER SLIDE ---
  deleteSlide(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer ce slide ?')) return;

    this.http.delete(`http://localhost:8080/slide/${id}`).subscribe({
      next: () => {
        this.loadSlides();
      },
      error: (err) => console.error('Erreur suppression slide', err)
    });
  }
}
