import { Component } from '@angular/core';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { NotificationService } from '../../../design/notification/notification.service';
declare var bootstrap: any;


@Component({
  selector: 'app-add-formation',
  templateUrl: './add-formation.component.html',
  styleUrl: './add-formation.component.css'
})
export class AddFormationComponent {
  title = '';
  description = '';
  image: File | null = null;
  price = 0;
  duration = 0;
  numberOfStudents = 0;


  constructor(private formationService: FormationServiceService, private notifService : NotificationService) { }

  onFileChange(event: any): void {
    this.image = event.target.files[0];
  }

  addFormation(): void {
    if (!this.image) {
      this.notifService.error("Vérifier les champs requis.");
      return;
    }
    this.formationService.addFormation(this.title, this.description, this.image, this.price , this.duration, this.numberOfStudents)
      .subscribe({
        next: (response) => {
          console.log('Formation ajouté:', response);

          // Afficher le modal après le succès
          const postModal = new bootstrap.Modal(document.getElementById('postModal'));
          postModal.show();
        },
        error: (error) => {
          console.error('Erreur:', error);
          let errorMessage = error.message || 'Une erreur est survenue lors de l\'ajout de la formation.';
          this.notifService.error(errorMessage);
        }
      });
  }

  reloadPage(): void {
    location.reload();
  }
}
