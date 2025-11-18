import { Component, OnInit } from '@angular/core';
import { CertificationService } from '../../../services/services/certificat/certification.service';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
declare var bootstrap: any;

@Component({
  selector: 'app-certif-list',
  templateUrl: './certif-list.component.html',
  styleUrl: './certif-list.component.css'
})
export class CertifListComponent implements OnInit {
  certifications: any[] = [];
  filteredCertifications: any[] = [];
  formations: any[] = [];
  selectedFormationId: number | null = null;
  searchTerm: string = '';

  selectedFormationUsers: any[] = [];
  selectedFormationTitle: string = '';
  error: any = null;
selectedCert: any = {
  userName: '',
  userAddress: '',
  status: 'VALID'
};

  constructor(
    private certificationService: CertificationService,
    private formationService: FormationServiceService
  ) {}

  ngOnInit(): void {
    this.loadFormations();
    this.loadCertifications();
  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (res) => this.formations = res,
      error: (err) => console.error('Erreur chargement formations', err)
    });
  }

  loadCertifications(): void {
    this.certificationService.getAllCertifications().subscribe({
      next: (res) => {
        this.certifications = res;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur chargement certifications', err);
        this.error = 'Impossible de charger les certifications';
      }
    });
  }

  applyFilters(): void {
    this.filteredCertifications = this.certifications.filter(cert => {
      const matchesFormation = this.selectedFormationId ? cert.formation?.id === this.selectedFormationId : true;
      const matchesSearch = this.searchTerm
        ? cert.user?.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          cert.user?.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      return matchesFormation && matchesSearch;
    });
  }

  onFormationChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  viewUsersForFormation(formationId: number, formationTitle: string) {
    this.selectedFormationTitle = formationTitle;
    this.formationService.getUsersByFormation(formationId).subscribe({
      next: (users) => {
        this.selectedFormationUsers = users;
        const modal = new bootstrap.Modal(
          document.getElementById('usersModal') as HTMLElement
        );
        modal.show();
      },
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }



deleteCertification(certId: number) {
  if (confirm("Voulez-vous vraiment supprimer ce certificat ?")) {
    this.certificationService.deleteCertification(certId).subscribe({
      next: () => {
        this.certifications = this.certifications.filter(c => c.id !== certId);
        this.applyFilters();
        alert("Certificat supprimé !");
      },
      error: (err) => console.error("Erreur suppression certificat", err)
    });
  }
}

}
