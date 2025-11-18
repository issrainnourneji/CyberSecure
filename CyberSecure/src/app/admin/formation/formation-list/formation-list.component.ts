import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { ChapterService } from '../../../services/services/Chapiters/chapter.service';
import { ModalDeleteConfirmationComponent } from '../../../design/modal/modal-delete-confirmation.component';
import { TokenService } from '../../../services/services/token.service';
import { NotificationService } from '../../../design/notification/notification.service';
import { CertificationService } from '../../../services/services/certificat/certification.service';
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

  newFormation: any = { title: '', description: '', price: 0, duration: 0, categorie: '' };
  newImageFile: File | null = null;
  addFormationModal: any;

    newChapitreTitre: string = '';
  addChapitreModal: any;
  formationIdForNewChapitre: number | null = null;
  error:any = null;
  selectedChapitre: any = null;
  editChapitreModal: any;
selectedUser: any = null;
p: number = 1;
selectedUsers: any[] = [];
selectedChapitres: any[] = [];

itemsPerPage: number = 9;
  idFormationToDelete : number = 0
  @ViewChild(ModalDeleteConfirmationComponent) modalDelete? : ModalDeleteConfirmationComponent ;
  params : any = {title : "Delete Formation", content : "voulez vous vraiment supprimer la formation!"}
selectedChapitreId: number | null = null;
selectedUserIdToRemove: number | null = null;
selectedFormationIdForUser: number | null = null;
  constructor(
    private formationService: FormationServiceService,
    private chapitreService: ChapterService,
    private notifService : NotificationService,
    private certificationService : CertificationService
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

  // 🔹 Vérifier pour chaque user si il a une certif pour cette formation
  this.selectedUsers.forEach(user => {
    this.certificationService.getCertificationsByUserAndFormation(user.id, this.selectedFormation.id)
      .subscribe({
        next: (certifs) => {
          user.hasCertification = certifs && certifs.length > 0;
        },
        error: (err) => console.error("Erreur certif user pour formation:", err)
      });
  });

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
    this.newFormation = { title: '', description: '', price: 0, duration: 0, categorie: '' };
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
    this.newFormation.categorie
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
      this.selectedFormation.categorie
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


   delete(): void {
  this.formationService.deleteFormation(this.idFormationToDelete).subscribe({
    next: (res: string) => {
      this.modalDelete?.close();
      this.formations = this.formations.filter(f => f.id !== this.idFormationToDelete);
      this.notifService.success(res); // Affiche "Formation supprimée avec succès !"
    },
    error: (err) => {
      console.error(err);
      this.modalDelete?.close();
      this.notifService.warn('Impossible de supprimer la formation ! Veuillez vérifier les dépendances.');
    }
  });
}

  confirmDelete(id : any) {
    this.idFormationToDelete = id ;
    this.modalDelete?.open();
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



openDeleteModal(chapitreId: number) {
  this.selectedChapitreId = chapitreId;
  const modalEl = document.getElementById('deleteChapitreModal');
  const modal = new bootstrap.Modal(modalEl!);
  modal.show();
}
confirmDeleteChapitre() {
  if (this.selectedChapitreId !== null) {
    this.chapitreService.deleteChapitre(this.selectedChapitreId).subscribe({
      next: () => {
        // Retirer le chapitre de la liste affichée
        this.selectedChapitres = this.selectedChapitres.filter(c => c.id !== this.selectedChapitreId);

        this.formations.forEach(formation => {
          if (formation.chapitres) {
            formation.chapitres = formation.chapitres.filter((c: any) => c.id !== this.selectedChapitreId);
          }
        });

        // Fermer le modal
        const modalEl = document.getElementById('deleteChapitreModal');
        const modal = bootstrap.Modal.getInstance(modalEl!);
        modal?.hide();

        this.selectedChapitreId = null;
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


// Ouvrir le modal
openRemoveUserModal(userId: number, formationId: number) {
  this.selectedUserIdToRemove = userId;
  this.selectedFormationIdForUser = formationId;
  const modalEl = document.getElementById('removeUserModal');
  const modal = new bootstrap.Modal(modalEl!);
  modal.show();
}

// Confirmer le retrait
confirmRemoveUser() {
  if (this.selectedUserIdToRemove !== null && this.selectedFormationIdForUser !== null) {
    this.formationService.removeUserFromFormation(this.selectedUserIdToRemove, this.selectedFormationIdForUser).subscribe({
      next: () => {
        // Retirer l'utilisateur de la liste affichée
        this.selectedUsers = this.selectedUsers.filter(u => u.id !== this.selectedUserIdToRemove);

        // Retirer de la formation globale
        this.formations.forEach(f => {
          if (f.id === this.selectedFormationIdForUser && f.users) {
            f.users = f.users.filter((u: any) => u.id !== this.selectedUserIdToRemove);
          }
        });

        // Fermer le modal
        const modalEl = document.getElementById('removeUserModal');
        const modal = bootstrap.Modal.getInstance(modalEl!);
        modal?.hide();

        this.selectedUserIdToRemove = null;
        this.selectedFormationIdForUser = null;


      },
      error: (err) => {
        console.error('Erreur lors du retrait de l’utilisateur', err);
        alert('Impossible de retirer l’utilisateur.');
      }
    });
  }
}


}
