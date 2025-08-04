import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TokenService } from '../../services/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent implements OnInit, OnDestroy {
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
  this.apiService.authStatuschanged.emit();
  window.location.reload();

}


  ngOnDestroy(): void {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }
}
