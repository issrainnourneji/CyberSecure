import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/services/token.service';
import { Subscription } from 'rxjs';
import { FormationServiceService } from '../../services/services/Formation/formation-service.service';
import { User } from '../../services/models/user';
import { Role } from '../../services/models/role';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  users: any[] = [];
  error:any = null;
  isAdmin: boolean = false;
  isClient: boolean = false;
  isAuthenticated: boolean = false;
  private authStatusSub: Subscription | null = null;
  formations: any[] = [];


  constructor(private router: Router, private readonly apiService: TokenService , private formationService: FormationServiceService){}

    ngOnInit(): void {
    this.isAuthenticated = this.apiService.isAuthenticated();
    this.isAdmin = this.apiService.isAdmin();
    this.isClient = this.apiService.isClient();



    this.authStatusSub = this.apiService.authStatuschanged.subscribe(() => {
      this.isAuthenticated = this.apiService.isAuthenticated();
      this.isAdmin = this.apiService.isAdmin();
      this.isClient = this.apiService.isClient();

    })

 this.formationService.getAllFormations().subscribe(
      (response) => {
        this.formations = response;
      },
      (error) => {
        console.error('Error fetching formations:', error);
      }
    );
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

    ngOnDestroy(): void {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }
}
