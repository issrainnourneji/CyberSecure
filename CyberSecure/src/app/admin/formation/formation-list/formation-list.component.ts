import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { ChapterService } from '../../../services/services/Chapiters/chapter.service';
declare var bootstrap: any;

@Component({
  selector: 'app-formation-list',
  templateUrl: './formation-list.component.html',
  styleUrls: ['./formation-list.component.css']
})
export class FormationListComponent implements OnInit, AfterViewInit {
  formations: any[] = [];
  selectedFormation: any = null;
  selectedImageFile: File | null = null;
  editModal: any;

  newFormation: any = { title: '', description: '', price: 0, duration: 0, numberOfStudents: 0 };
  newImageFile: File | null = null;
  addFormationModal: any;

    newChapitreTitre: string = '';
  addChapitreModal: any;
  formationIdForNewChapitre: number | null = null;

  selectedChapitre: any = null;
  editChapitreModal: any;

  constructor(
    private formationService: FormationServiceService,
    private chapitreService: ChapterService
  ) {}

  ngOnInit(): void {
    this.loadFormations();
    this.editChapitreModal = new bootstrap.Modal(document.getElementById('editChapitreModal'));
        this.addChapitreModal = new bootstrap.Modal(document.getElementById('addChapitreModal'));

  }

  ngAfterViewInit(): void {
    this.editModal = new bootstrap.Modal(document.getElementById('editFormationModal'));
    this.addFormationModal = new bootstrap.Modal(document.getElementById('addFormationModal'));
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

  // Ajout de formation
  openAddFormationModal(): void {
    this.newFormation = { title: '', description: '', price: 0, duration: 0, numberOfStudents: 0 };
    this.newImageFile = null;
    this.addFormationModal.show();
  }

  onNewImageSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.newImageFile = event.target.files[0];
    }
  }

onSubmitAddFormation(): void {
  if (!this.newImageFile) {
    console.error('Veuillez sélectionner une image avant d’ajouter la formation.');
    return;
  }

  this.formationService.addFormation(
    this.newFormation.title,
    this.newFormation.description,
    this.newImageFile, // ici on est sûr qu’il y a un fichier
    this.newFormation.price,
    this.newFormation.duration,
    this.newFormation.numberOfStudents
  ).subscribe({
    next: (created) => {
      this.formations.push(created);
      this.addFormationModal.hide();
    },
    error: (err) => {
      console.error('Erreur lors de l’ajout de la formation:', err);
    }
  });
}


  // Modification de formation
  openEditModal(formation: any): void {
    this.selectedFormation = { ...formation };
    this.selectedImageFile = null;
    this.editModal.show();
  }

  onImageSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedImageFile = event.target.files[0];
    }
  }

  onSubmitEditFormation(): void {
    this.formationService.updateFormation(
      this.selectedFormation.id,
      this.selectedFormation.title,
      this.selectedFormation.description,
      this.selectedImageFile,
      this.selectedFormation.price,
      this.selectedFormation.duration,
      this.selectedFormation.numberOfStudents
    ).subscribe({
      next: (updated) => {
        const index = this.formations.findIndex(f => f.id === updated.id);
        if (index !== -1) {
          this.formations[index] = updated;
        }
        this.editModal.hide();
      },
      error: (err) => {
        console.error('Erreur lors de la modification:', err);
      }
    });
  }

  editFormation(formation: any): void {
    this.openEditModal(formation);
  }

  deleteFormation(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette formation ?')) {
      this.formationService.deleteFormation(id).subscribe({
        next: () => {
          this.formations = this.formations.filter(f => f.id !== id);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de la formation:', err);
        }
      });
    }
  }

  // Modification chapitre
  editChapitre(chapitre: any): void {
    this.selectedChapitre = { ...chapitre };
    this.editChapitreModal.show();
  }

  onSubmitEditChapitre(): void {
    this.chapitreService.updateChapitre(this.selectedChapitre.id, this.selectedChapitre.titre).subscribe({
      next: (updated) => {
        const formation = this.formations.find(f => f.chapitres.some((c: any) => c.id === updated.id));
        if (formation) {
          const index = formation.chapitres.findIndex((c: any) => c.id === updated.id);
          if (index !== -1) {
            formation.chapitres[index] = updated;
          }
        }
        this.editChapitreModal.hide();
      },
      error: (err) => {
        console.error('Erreur lors de la modification du chapitre:', err);
      }
    });
  }

  openAddChapitreModal(formationId: number): void {
    this.newChapitreTitre = '';
    this.formationIdForNewChapitre = formationId;
    this.addChapitreModal.show();
  }

  onSubmitAddChapitre(): void {
    if (!this.newChapitreTitre.trim() || !this.formationIdForNewChapitre) return;
    this.chapitreService.addChapitre(this.formationIdForNewChapitre, this.newChapitreTitre).subscribe({
      next: (newChapitre) => {
        const formation = this.formations.find(f => f.id === this.formationIdForNewChapitre);
        if (formation) {
          formation.chapitres.push(newChapitre);
        }
        this.addChapitreModal.hide();
      },
      error: (err) => console.error('Erreur lors de l’ajout du chapitre:', err)
    });
  }

  deleteChapitre(chapitreId: number): void {
  if (confirm('Voulez-vous vraiment supprimer ce chapitre ?')) {
    this.chapitreService.deleteChapitre(chapitreId).subscribe({
      next: () => {
        // Retirer le chapitre de la liste affichée (dans formations)
        this.formations.forEach(formation => {
          if (formation.chapitres) {
            formation.chapitres = formation.chapitres.filter((c: any) => c.id !== chapitreId);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du chapitre :', err);
      }
    });
  }
}

}
