import { Component, OnInit } from '@angular/core';
import { RDVDto } from '../../../services/models/rdv';
import { RdvService } from '../../../services/services/RDVs/rdv.service';
import { CalendarOptions } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
declare var bootstrap: any;

@Component({
  selector: 'app-rdv-list',
  templateUrl: './rdv-list.component.html',
  styleUrl: './rdv-list.component.css'
})
export class RdvListComponent implements OnInit {

 appointments: RDVDto[] = [];
  errorMessage: string = '';
  selectedRDV: RDVDto | null = null;
statusFilter: string = ''; // vide = aucun filtre par statut
dateSort: string = 'asc';
  filteredAppointments: RDVDto[] = [];
p: number = 1;              // page actuelle
itemsPerPage: number = 6;    // RDVs par page
totalPages: number = 1;

calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  height: 'auto',
  contentHeight: 600,
  aspectRatio: 1.5,
  navLinks: true,
  editable: false,
  selectable: true,
  dayMaxEvents: true,
  eventDisplay: 'block',
  eventTextColor: 'white',
  eventBorderColor: 'transparent',

  // Événement au clic
  eventClick: (info) => {
    const rdv = this.appointments.find(a => a.id.toString() === info.event.id);
    if (rdv) this.openModal(rdv);
  },

  // Ajouter des classes selon le statut
  eventClassNames: (arg) => {
    const rdv = this.appointments.find(a => a.id.toString() === arg.event.id);
    return rdv ? [`fc-event-${rdv.status.toLowerCase()}`] : [];
  },

  // Modernisation de l'affichage des jours
  dayCellClassNames: (arg) => {
    const today = new Date();
    if (arg.date.toDateString() === today.toDateString()) {
      return ['fc-today-modern']; // jour actuel avec highlight
    }
    return ['fc-day-modern']; // style général pour tous les jours
  },

  // Format des titres
  views: {
    dayGridMonth: { titleFormat: { year: 'numeric', month: 'long' } },
    timeGridWeek: { titleFormat: { year: 'numeric', month: 'short', day: 'numeric' } }
  }
};



  constructor(private rdvService: RdvService) { }

  ngOnInit(): void {
 this.loadAppointments();
  }



applyFilters() {
  let temp = [...this.appointments];

  // Filtrer par statut uniquement si un filtre est choisi
  if (this.statusFilter) {
    temp = temp.filter(r => r.status === this.statusFilter);
  }

  // Trier par date
  temp.sort((a, b) => {
    const dateA = new Date(a.rdvdate).getTime();
    const dateB = new Date(b.rdvdate).getTime();
    return this.dateSort === 'asc' ? dateA - dateB : dateB - dateA;
  });

  this.filteredAppointments = temp;

  // ⚡️ Réinitialiser la page à 1 et calculer totalPages
  this.p = 1;
  this.updateTotalPages();
}

  loadAppointments(): void {
    this.rdvService.getAllAppointments().subscribe({
      next: data => {
        this.appointments = data;
        this.calendarOptions.events = this.appointments.map(rdv => ({
          id: rdv.id.toString(),
          title: `${rdv.status}`,
          start: rdv.rdvdate,
          color: rdv.status === 'PENDING' ? '#FFC107' :
                 rdv.status === 'CONFIRMED' ? '#28A745' :
                 rdv.status === 'CANCELLED' ? '#DC3545' : '#6C757D',
        }));
        this.applyFilters();
        this.loadCalendarEvents();
        this.scheduleReminders();
      },
      error: () => this.errorMessage = 'Erreur lors du chargement des rendez-vous'
    });
  }

  scheduleReminders() {
  const now = new Date().getTime();

  this.appointments.forEach(rdv => {
    const rdvTime = new Date(rdv.rdvdate).getTime();
    const reminderTime = rdvTime - 2 * 60 * 60 * 1000; // 2h avant

    if (reminderTime > now) {
      const delay = reminderTime - now;

      setTimeout(() => {
        alert(
          `⏰ [Admin] Rappel : Rendez-vous "${rdv.rdvtype}" prévu le ${new Date(rdv.rdvdate).toLocaleString()}`
        );
      }, delay);
    }
  });
}


  loadCalendarEvents() {
  this.calendarOptions.events = this.appointments.map(rdv => ({
    id: rdv.id.toString(),
    title: ` ${rdv.status}`, // titre avec statut
    start: rdv.rdvdate,
    color: rdv.status === 'PENDING' ? '#FFC107' :
           rdv.status === 'CONFIRMED' ? '#28A745' :
           '#DC3545' // couleurs pour PENDING / CONFIRMED / CANCELLED
  }));
}


  openModal(rdv: RDVDto) {
    this.selectedRDV = rdv;
    const modal = new bootstrap.Modal(document.getElementById('rdvModal'));
    modal.show();
  }
confirmRDV(id: number): void {
  if (confirm('Voulez-vous confirmer ce rendez-vous ?')) {
    this.rdvService.confirmRDV(id).subscribe({
      next: () => {
        // 🔥 Met à jour directement la liste complète des RDVs
        this.appointments = this.appointments.map(rdv =>
          rdv.id === id ? { ...rdv, status: 'CONFIRMED' } : rdv
        );

        // 🔥 Met à jour le RDV affiché dans le modal
        this.selectedRDV = this.appointments.find(rdv => rdv.id === id) || null;

        // 🔥 Réapplique les filtres pour que la liste filtrée se mette à jour
        this.applyFilters();
        this.loadCalendarEvents();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la confirmation du rendez-vous';
      }
    });
  }
}

get paginatedAppointments() {
  const start = (this.p - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.filteredAppointments.slice(start, end);
}


updateTotalPages() {
  this.totalPages = Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
}
// Limiter les pages visibles dans la pagination (ex: max 3)
getVisiblePages(): number[] {
  const visiblePages: number[] = [];
  let startPage = Math.max(this.p - 1, 1);
  let endPage = Math.min(startPage + 2, this.totalPages);

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return visiblePages;
}


}
