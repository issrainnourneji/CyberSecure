import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RdvService } from '../../../services/services/RDVs/rdv.service';
import { TokenService } from '../../../services/services/token.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../../design/notification/notification.service';
import { CalendarOptions } from '@fullcalendar/core';
import { RDVDto } from '../../../services/models/rdv';
declare var bootstrap: any;



@Component({
  selector: 'app-add-rdv',
  templateUrl: './add-rdv.component.html',
  styleUrl: './add-rdv.component.css'
})
export class AddRdvComponent implements OnInit{

  rendezv = {
    id: 0,
    RDVDate: '',
    RDVType: '',
    notes: '',
    status: '',
  };
  minDateTime: string = '';

  appointments: RDVDto[] = [];
  errorMessage: string = '';

  constructor(private notifService: NotificationService, private rdvService: RdvService)
   { }

  ngOnInit(): void {
 this.rdvService.getMyAppointments().subscribe({
      next: data => this.appointments = data,
      error: err => this.errorMessage = 'Erreur lors du chargement des rendez-vous'
    });
  }

validateForm(): boolean {
    const { RDVDate, RDVType, notes } = this.rendezv;
    const now = new Date();
    const selectedDate = new Date(RDVDate);

    if (!RDVDate) {
      this.notifService.error('Veuillez sélectionner une date.');
      return false;
    }

    if (selectedDate <= now) {
      this.notifService.error('La date du rendez-vous doit être dans le futur.');
      return false;
    }

    if (!RDVType) {
      this.notifService.error('Veuillez sélectionner un type de rendez-vous.');
      return false;
    }

    if (!notes || notes.trim().length < 10) {
      this.notifService.error('Les notes doivent contenir au moins 10 caractères.');
      return false;
    }

    return true;
  }

  confirmAddAppointment(): void {
    if (!this.validateForm()) {
      return;
    }
    this.rdvService.addRdv(this.rendezv).subscribe({
      next: (response) => {
        console.log('Rendez-vous ajouté avec succès :', response);
        // Vérifier que l'élément modal existe avant d'essayer de le cacher
        const modalElement = document.getElementById('appointmentModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
        window.location.reload();
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du rendez-vous :', err);
        alert('Une erreur est survenue.');
      },
    });
  }

}
