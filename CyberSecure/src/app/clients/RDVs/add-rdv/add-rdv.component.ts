import { Component, OnInit, ViewChild } from '@angular/core';
import { RdvService } from '../../../services/services/RDVs/rdv.service';
import { NotificationService } from '../../../design/notification/notification.service';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { RDVDto } from '../../../services/models/rdv';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
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
viewRdv: any = null;
  appointments: RDVDto[] = [];
  errorMessage: string = '';

  editRdv: any = {};
  selectedRdvId: number | null = null;
p: number = 1; // page actuelle
pageSize: number = 6;
calendarOptions: CalendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
events: this.appointments.map(rdv => ({
  id: rdv.id.toString(),
  title: rdv.rdvtype,
  date: rdv.rdvdate,
  backgroundColor:
    rdv.status === 'CONFIRMED' ? '#4c8ec4' :
    rdv.status === 'PENDING' ? '#f75b70' :
    '#adb5bd',
  borderColor: 'transparent',
  textColor: '#fff'
})),
  navLinks: true,
  editable: false,
  selectable: true,
  dayMaxEvents: true,
  height: 'auto',
  eventClick: (info) => {
    const rdv = this.appointments.find(a => a.id.toString() === info.event.id);
    if (rdv) {
      if (rdv.status === 'CONFIRMED') {
        this.openViewModal(rdv);  // Modal de consultation
      } else if (rdv.status === 'PENDING') {
        this.openEditModal(rdv);  // Modal de modification
      }
    }
  },
};

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;


  constructor(private notifService: NotificationService, private rdvService: RdvService)
   { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.rdvService.getMyAppointments().subscribe({
      next: data => {
        this.appointments = data;
        this.loadCalendarEvents();
        this.scheduleReminders();
      },
      error: err => this.errorMessage = 'Erreur lors du chargement des rendez-vous'
    });
  }

scheduleReminders() {
  const now = new Date().getTime();

  this.appointments.forEach(rdv => {
    const rdvTime = new Date(rdv.rdvdate).getTime();
    const reminderTime = rdvTime - 2 * 60 * 60 * 1000; // 2h avant en ms

    if (reminderTime > now) {
      const delay = reminderTime - now;

      setTimeout(() => {
        alert(
          `⏰ Rappel : Vous avez un rendez-vous "${rdv.rdvtype}" prévu le ${new Date(rdv.rdvdate).toLocaleString()}`
        );
      }, delay);
    }
  });
}


  openViewModal(rdv: any) {
  this.viewRdv = rdv;
  const modal = new bootstrap.Modal(document.getElementById('viewAppointmentModal')!);
  modal.show();
}

  loadCalendarEvents() {
    this.calendarOptions.events = this.appointments.map(rdv => ({
      id: rdv.id.toString(),
      title: `${rdv.status}`,
      start: rdv.rdvdate,
      color: rdv.status === 'PENDING' ? '#FFC107' :
             rdv.status === 'CONFIRMED' ? '#28A745' :
             '#DC3545'
    }));
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
  // Vérification du formulaire complet
  if (!this.validateForm()) {
    return;
  }

  // Vérifier que la date est dans le futur
  if (!this.rendezv.RDVDate || new Date(this.rendezv.RDVDate) <= new Date()) {
    // Afficher une alerte stylée
    alert('La date du rendez-vous doit être dans le futur !');
    return;
  }

  // Appel au service pour ajouter le RDV
  this.rdvService.addRdv(this.rendezv).subscribe({
    next: (response) => {
      console.log('Rendez-vous ajouté avec succès :', response);

      // Fermer le modal proprement
      const modalElement = document.getElementById('addAppointmentModal'); // attention à l'ID correct
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      }

      // Rafraîchir ou mettre à jour la liste
      window.location.reload();
    },
    error: (err) => {
      // Alerte d'erreur stylée
      alert('Erreur lors de la création : ' + (err.error?.error || err.message));
    },
  });
}


openEditModal(rdv: any) {
  if (rdv.status !== 'PENDING') return;  // sécurité, seulement pour PENDING

  this.selectedRdvId = rdv.id;
  this.editRdv = {
    rdvdate: new Date(rdv.rdvdate).toISOString().slice(0,16),
    rdvtype: rdv.rdvtype,
    notes: rdv.notes
  };

  const modal = new bootstrap.Modal(document.getElementById('editAppointmentModal')!);
  modal.show();
}



  // Format ISO string en format datetime-local (ex: '2025-08-12T14:30')
  formatDateForInput(dateStr: string) {
    const date = new Date(dateStr);
    return date.toISOString().slice(0,16);
  }
isPastDate(dateString: string): boolean {
  if (!dateString) return false; // pas de date => pas d'erreur
  const selectedDate = new Date(dateString);
  const now = new Date();
  return selectedDate <= now; // true si date passée
}
submitEdit() {
  if (!this.selectedRdvId) return;

  const payload = {
    RDVDate: new Date(this.editRdv.rdvdate).toISOString().slice(0,19),
    notes: this.editRdv.notes || '',
    RDVType: this.editRdv.rdvtype
  };

  this.rdvService.updateRDV(this.selectedRdvId, payload).subscribe({
    next: updatedRdv => {
      // Mise à jour locale
      const index = this.appointments.findIndex(a => a.id === this.selectedRdvId);
      if (index > -1) this.appointments[index] = updatedRdv;

      // Mettre à jour le calendrier
      if (this.calendarComponent?.getApi) {
        const calendarApi = this.calendarComponent.getApi();
        // Retirer l’ancien événement
        const oldEvent = calendarApi.getEventById(updatedRdv.id.toString());
        if (oldEvent) oldEvent.remove();

        // Ajouter l’événement mis à jour
        calendarApi.addEvent({
          id: updatedRdv.id.toString(),
          title: updatedRdv.rdvtype,
          start: updatedRdv.rdvdate,
          color: updatedRdv.status === 'PENDING' ? '#FFC107' :
                 updatedRdv.status === 'CONFIRMED' ? '#28A745' :
                 '#DC3545'
        });
      }

      // Fermer modal Bootstrap
      const modalEl = document.getElementById('editAppointmentModal')!;
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    },
    error: err => {
      alert('Erreur lors de la modification : ' + err.error?.error || err.message);
    }
  });
}


  confirmDelete(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce rendez-vous ?')) {
      this.rdvService.deleteRDV(id).subscribe({
        next: () => {
          this.appointments = this.appointments.filter(r => r.id !== id);
        },
        error: err => {
          alert('Erreur lors de la suppression : ' + err.error?.error || err.message);
        }
      });
    }
  }

  deleteSelectedRdv() {
  if (!this.selectedRdvId) return;

  if (confirm('Voulez-vous vraiment supprimer ce rendez-vous ?')) {
    this.rdvService.deleteRDV(this.selectedRdvId).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(r => r.id !== this.selectedRdvId);

        // Fermer le modal
        const modalEl = document.getElementById('editAppointmentModal')!;
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
        this.loadAppointments();
      },
      error: err => {
        alert('Erreur lors de la suppression : ' + err.error?.error || err.message);
      }
    });
  }
}
get totalPages(): number {
  return Math.ceil(this.appointments.length / this.pageSize);
}

// Fonction pour limiter les pages affichées à 3 autour de la page actuelle
getVisiblePages(): number[] {
  const pages: number[] = [];
  let start = Math.max(1, this.p - 1);
  let end = Math.min(this.totalPages, start + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

// Renvoie les rendez-vous pour la page actuelle
paginatedAppointments(): any[] {
  const start = (this.p - 1) * this.pageSize;
  return this.appointments.slice(start, start + this.pageSize);
}

}
