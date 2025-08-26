import { Component, OnInit } from '@angular/core';
import { RDVDto } from '../../../services/models/rdv';
import { RdvService } from '../../../services/services/RDVs/rdv.service';

@Component({
  selector: 'app-rdv-list',
  templateUrl: './rdv-list.component.html',
  styleUrl: './rdv-list.component.css'
})
export class RdvListComponent implements OnInit {

  appointments: RDVDto[] = [];
  errorMessage: string = '';

  constructor(private rdvService: RdvService) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.rdvService.getAllAppointments().subscribe({
      next: data => this.appointments = data,
      error: () => this.errorMessage = 'Erreur lors du chargement des rendez-vous'
    });
  }

  confirmRDV(id: number): void {
    if (confirm('Voulez-vous confirmer ce rendez-vous ?')) {
      this.rdvService.confirmRDV(id).subscribe({
        next: () => {
          // Mettre à jour localement le statut sans recharger toute la page
          this.appointments = this.appointments.map(rdv =>
            rdv.id === id ? { ...rdv, status: 'CONFIRMED' } : rdv
          );
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la confirmation du rendez-vous';
        }
      });
    }
  }
}
