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
selectedUser: any = null;
p: number = 1;
selectedUsers: any[] = [];
selectedChapitres: any[] = [];

itemsPerPage: number = 9;

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

  openUsersModal(formation: any) {
  this.selectedUsers = formation.users || [];
  this.selectedFormation = formation;
  const modal = new bootstrap.Modal(document.getElementById('usersModal') as HTMLElement);
  modal.show();
}

openChapitresModal(formation: any) {
  this.selectedChapitres = formation.chapitres || [];
  this.selectedFormation = formation;
  const modal = new bootstrap.Modal(document.getElementById('chapitresModal') as HTMLElement);
  modal.show();
}

loadFormations(): void {
  this.formationService.getAllFormations().subscribe({
    next: (formations) => {
      this.formations = formations;

      this.formations.forEach(f => {
  this.formationService.getUsersByFormation(f.id).subscribe({
    next: (users) => f.users = users,
    error: (err) => console.error('Impossible de récupérer les users pour formation', f.id, err)
  });
});
    },
    error: (err) => console.error('Erreur chargement formations', err)
  });
}


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
    this.newImageFile,
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
        if (!formation.chapitres) {
          formation.chapitres = [];
        }
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
        // Retirer le chapitre de la liste affichée dans le modal
        this.selectedChapitres = this.selectedChapitres.filter(c => c.id !== chapitreId);

        // Si tu veux aussi retirer du tableau formations global
        this.formations.forEach(formation => {
          if (formation.chapitres) {
            formation.chapitres = formation.chapitres.filter((c: any) => c.id !== chapitreId);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du chapitre :', err);
        alert('Impossible de supprimer le chapitre.');
      }
    });
  }
}

viewUser(user: any) {
  this.selectedUser = user;

  const modal = new bootstrap.Modal(
    document.getElementById('viewUserModal') as HTMLElement
  );
  modal.show();
}

removeUserFromFormation(userId: number, formationId: number) {
  if (confirm('Voulez-vous vraiment retirer cet utilisateur de la formation ?')) {
    this.formationService.removeUserFromFormation(userId, formationId).subscribe({
      next: () => {
        this.selectedUsers = this.selectedUsers.filter(u => u.id !== userId);


          alert('Utilisateur retiré avec succès');


        this.formations.forEach(f => {
          if (f.id === formationId && f.users) {
            f.users = f.users.filter((u:any) => u.id !== userId);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors du retrait de l’utilisateur', err);
        alert('Impossible de retirer l’utilisateur.');
      }
    });
  }
}


}
