import { Component, OnDestroy, OnInit } from '@angular/core';
import { TokenService } from '../../services/services/token.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent implements OnInit, OnDestroy {
  constructor(private readonly apiService: TokenService, private router: Router) { }

  isAdmin: boolean = false;
  isClient: boolean = false;
  isAuthenticated: boolean = false;

  private authStatusSub: Subscription | null = null;



  ngOnInit(): void {

    this.isAuthenticated = this.apiService.isAuthenticated();
    this.isAdmin = this.apiService.isAdmin();
    this.isClient = this.apiService.isClient();


    this.authStatusSub = this.apiService.authStatuschanged.subscribe(() => {
      this.isAuthenticated = this.apiService.isAuthenticated();
      this.isAdmin = this.apiService.isAdmin();
      this.isClient = this.apiService.isClient();

    })
  }


  confirmLogout() {
  this.apiService.logout();
  this.router.navigate(['home']);
  this.apiService.authStatuschanged.emit();
  window.location.reload();

}


  ngOnDestroy(): void {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }
}
