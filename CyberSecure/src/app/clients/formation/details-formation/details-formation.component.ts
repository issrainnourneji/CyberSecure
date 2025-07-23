import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationServiceService } from '../../../services/services/Formation/formation-service.service';
import { TokenService } from '../../../services/services/token.service';
import { User } from '../../../services/models/user';
import { Role } from '../../../services/models/role';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details-formation',
  templateUrl: './details-formation.component.html',
  styleUrl: './details-formation.component.css'
})
export class DetailsFormationComponent {
formation: any;
users: any[] = [];
error:any = null;
formations: any[] = [];

  isAdmin: boolean = false;
  isClient: boolean = false;
  isAuthenticated: boolean = false;
  private authStatusSub: Subscription | null = null;

constructor(private router: Router, private route: ActivatedRoute,private readonly apiService: TokenService, private formationService: FormationServiceService) {}

ngOnInit(): void {

   this.isAuthenticated = this.apiService.isAuthenticated();
    this.isAdmin = this.apiService.isAdmin();
    this.isClient = this.apiService.isClient();



    this.authStatusSub = this.apiService.authStatuschanged.subscribe(() => {
      this.isAuthenticated = this.apiService.isAuthenticated();
      this.isAdmin = this.apiService.isAdmin();
      this.isClient = this.apiService.isClient();

    })

  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.formationService.getFormationById(+id).subscribe(
      data => this.formation = data,
      error => console.error('Erreur de récupération formation', error)
    );
  }
  this.loadUsers();
  this.formationService.getAllFormations().subscribe(
      (response) => {
        this.formations = response;
      },
      (error) => {
        console.error('Error fetching formations:', error);
      }
    );
}
loadUsers(): void {
  this.apiService.getAllUsers().subscribe({
    next: (response) => {
      this.users = (response.userList || []).filter((user: User) => user.role === Role.USER);
    },
    error: (err) => {
      this.error = err?.error?.message || 'unable to get users';
    }
  });
}

login(){
    if (this.isAuthenticated) {
      if (this.isAdmin) {
        this.router.navigate(['/homeAdmin']);
      } else if (this.isClient) {
        this.router.navigate(['/homeUser']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }


}
