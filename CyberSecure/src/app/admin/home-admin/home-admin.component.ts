import { Component, OnDestroy, OnInit } from '@angular/core';
import { TokenService } from '../../services/services/token.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormationServiceService } from '../../services/services/Formation/formation-service.service';
import { User } from '../../services/models/user';
import { Role } from '../../services/models/role';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent  implements OnInit {

  users: any[] = [];
  error:any = null;
  formations: any[] = [];
    chapitres: any[] = [];


studentsCount: { [formationId: number]: number } = {};

  constructor(private router: Router, private readonly apiService: TokenService , private formationService: FormationServiceService){}

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
            this.loadUsers();

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
