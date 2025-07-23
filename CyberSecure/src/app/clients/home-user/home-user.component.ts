import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/services/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent implements OnInit, OnDestroy {
  constructor(private readonly apiService: TokenService, private router: Router) { }

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
  this.router.navigate(['/home']);
  this.apiService.authStatuschanged.emit();
  window.location.reload();

}

  ngOnDestroy(): void {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }

}
