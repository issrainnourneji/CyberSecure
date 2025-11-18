import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/services/token.service';
import { Subscription } from 'rxjs';
import { FormationServiceService } from '../../services/services/Formation/formation-service.service';
import { User } from '../../services/models/user';
import { Role } from '../../services/models/role';
import { CertificationService } from '../../services/services/certificat/certification.service';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent implements OnInit {
  users: any[] = [];
  formations: any[] = [];
    error:any = null;
studentsCount: { [formationId: number]: number } = {};

  successRate: number = 0;
  certifications: any[] = [];
  constructor(private router: Router, private readonly apiService: TokenService ,
    private formationService: FormationServiceService, private certificationService : CertificationService){}
 ngOnInit(): void {

 this.formationService.getAllFormations().subscribe(
      (response) => {
        this.formations = response;
      },
      (error) => {
        console.error('Error fetching formations:', error);
      }
    );
    this.formationService.getNumberOfStudentsForAllFormations().subscribe({
  next: (counts) => {
    this.studentsCount = counts;
  },
  error: (err) => console.error('Impossible de récupérer le nombre de students', err)
});
            this.loadUsers(); // Charger users
    this.apiService.getAllUsers().subscribe({
      next: (res) => {
        this.users = (res.userList || []).filter((u:any) => u.role === Role.USER);
        this.calculateSuccessRate();
      },
      error: (err) => console.error(err)
    });

    // Charger formations
    this.formationService.getAllFormations().subscribe({
      next: (formations) => {
        this.formations = formations;
        this.calculateSuccessRate();
      },
      error: (err) => console.error(err)
    });

    // Charger certifications
    this.certificationService.getAllCertifications().subscribe({
      next: (certs) => {
        this.certifications = certs;
        this.calculateSuccessRate();
      },
      error: (err) => console.error(err)
    });

  }
calculateSuccessRate() {
    if (!this.users || !this.formations || !this.certifications) return;

    const totalUsers = this.users.length;
    const totalFormations = this.formations.length;

    if (totalUsers === 0 || totalFormations === 0) {
      this.successRate = 0;
      return;
    }

    // Chaque certification = réussite d'une formation par un user
    const totalSuccesses = this.certifications.length;

    const totalPossible = totalUsers * totalFormations;

    this.successRate = (totalSuccesses / totalPossible) * 100;
  }

  loadUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (response) => {
      this.users = (response.userList || []).filter((user: User) => user.role === Role.USER);
      },
      error: (err) =>{
        this.error = err?.error?.message || 'unable to get users'
      }
    });
  }
}
