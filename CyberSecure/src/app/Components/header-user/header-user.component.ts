import { Component, OnDestroy, OnInit } from '@angular/core';
import { TokenService } from '../../services/services/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent implements OnInit, OnDestroy {
  constructor(private readonly apiService: TokenService) { }

  isAdmin: boolean = false;
  isAuthenticated: boolean = false;
  private authStatusSub: Subscription | null = null;



  ngOnInit(): void {
    this.isAuthenticated = this.apiService.isAuthenticated();
    this.isAdmin = this.apiService.isAdmin();

    this.authStatusSub = this.apiService.authStatuschanged.subscribe(() => {
      this.isAuthenticated = this.apiService.isAuthenticated();
      this.isAdmin = this.apiService.isAdmin();
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
