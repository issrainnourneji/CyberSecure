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
    this.rdvService.getAllAppointments().subscribe({
      next: data => this.appointments = data,
      error: err => this.errorMessage = 'Erreur lors du chargement des rendez-vous'
    });
  }

}
