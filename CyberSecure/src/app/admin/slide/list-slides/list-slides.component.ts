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
removeImage: boolean = false;  newSelectedImage: File | null = null;

  formations: any[] = [];
  chapitres: any[] = [];
  selectedFormationId: number | null = null;
  selectedChapitreId: number | null = null;

  addSlideModal : any;
  editSlideModal: any;
  p: number = 1;
filteredSlides: any[] = [];
totalPages: number = 0;
itemsPerPage: number = 4;

  constructor(private formationService: FormationServiceService, private slideService: SlideService, private http: HttpClient, private chapitreService: ChapterService,) {}

  ngOnInit(): void {
    this.loadSlides();
    this.loadFormations();
  }

  loadSlides(): void {
    this.slideService.getAllSlides().subscribe({
      next: (data) => {
        this.slides = data;
        this.filteredSlides = data;
this.updatePagination();
      },
      error: (err) => {
        console.error('Erreur chargement slides', err);
      }
    });

  }

  updatePagination(): void {
  this.totalPages = Math.ceil(this.filteredSlides.length / this.itemsPerPage);
  if (this.p > this.totalPages) {
    this.p = this.totalPages || 1;
  }
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
      next: data => {
        this.chapitres = data;
        this.selectedChapitreId = null;
        this.applyFilter();
      },
      error: err => console.error('Erreur chargement chapitres', err)
    });
  } else {
    this.chapitres = [];
    this.selectedChapitreId = null;
    this.applyFilter();
  }
}

onChapitreChange() {
  this.applyFilter();
}

applyFilter() {
  this.filteredSlides = this.slides.filter(slide => {
    return (!this.selectedFormationId || slide.chapitre?.formation?.id === this.selectedFormationId)
        && (!this.selectedChapitreId || slide.chapitre?.id === this.selectedChapitreId);
  });
  this.p = 1;
  this.updatePagination();
}


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

  this.slideService.addSlide(this.selectedChapitreId, formData).subscribe({
    next: () => {
      this.loadSlides();
      this.addSlideModal.hide();
    },
    error: err => console.error('Erreur ajout slide', err)
  });
}

 editSlide(slide: any): void {
  this.selectedSlide = { ...slide };
  this.selectedImage = null;

  const modal = document.getElementById('editSlideModal');
  if (modal) {
    this.editSlideModal = new bootstrap.Modal(modal);
    this.editSlideModal.show();
  }
}

onImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedImage = file;
    this.removeImage = false;
  } else {
    this.selectedImage = null;
    this.removeImage = true;
  }
}


onRemoveImage(): void {
  this.selectedImage = null;
  this.removeImage = true;
  if (this.selectedSlide) {
    this.selectedSlide.imageUrl = '';
  }
}



onSubmitEditSlide(): void {
  if (!this.selectedSlide) return;

  const formData = new FormData();

  const fields = [
    'titre',
    'sousTitre',
    'paragraphe',
    'videoUrl',
    'imageWidth',
    'imageHeight',
    'imagePosition',
    'imagePositionY'
  ];
  fields.forEach(f => formData.append(f, this.selectedSlide[f] || ''));

  if (this.selectedImage) {
    formData.append('image', this.selectedImage);
  } else if (this.removeImage) {
    formData.append('removeImage', 'true'); 
  }

  this.http.put(`http://localhost:8080/slide/${this.selectedSlide.id}`, formData).subscribe({
    next: () => {
      this.loadSlides();
      this.selectedImage = null;
      this.removeImage = false;
      this.editSlideModal?.hide();
    },
    error: err => console.error('Erreur update slide', err)
  });
}




 deleteSlide(id: number): void {
  if (!confirm('Voulez-vous vraiment supprimer ce slide ?')) return;

  this.http.delete(`http://localhost:8080/slide/${id}`).subscribe({
    next: () => {
      this.loadSlides();
    },
    error: err => console.error('Erreur suppression slide', err)
  });
}

getVisiblePages(): number[] {
  const pages: number[] = [];
  const total = this.totalPages;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    let start = Math.max(1, this.p - 2);
    let end = Math.min(total, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) pages.push(i);
  }

  return pages;
}


}
