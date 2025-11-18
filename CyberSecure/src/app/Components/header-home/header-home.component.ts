import { Component, OnDestroy, OnInit } from '@angular/core';
import { TokenService } from '../../services/services/token.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormationServiceService } from '../../services/services/Formation/formation-service.service';

@Component({
  selector: 'app-header-home',
  templateUrl: './header-home.component.html',
  styleUrl: './header-home.component.css'
})
export class HeaderHomeComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  isClient: boolean = false;
  isAuthenticated: boolean = false;
  private authStatusSub: Subscription | null = null;

categories: string[] = [];
  constructor(private router: Router, private readonly apiService: TokenService, private formationService: FormationServiceService){}

    ngOnInit(): void {
    this.isAuthenticated = this.apiService.isAuthenticated();
    this.isAdmin = this.apiService.isAdmin();
    this.isClient = this.apiService.isClient();



    this.authStatusSub = this.apiService.authStatuschanged.subscribe(() => {
      this.isAuthenticated = this.apiService.isAuthenticated();
      this.isAdmin = this.apiService.isAdmin();
      this.isClient = this.apiService.isClient();

    })

    this.formationService.getCategories().subscribe(data => {
    this.categories = data;
  });
  }
    login(){
    if (this.isAuthenticated) {
      if (this.isAdmin) {
        this.router.navigate(['/mainAdmin/home']);
      } else if (this.isClient) {
        this.router.navigate(['/mainUser/home']);
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
