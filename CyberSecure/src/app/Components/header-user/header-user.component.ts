import { Component, OnDestroy, OnInit } from '@angular/core';
import { TokenService } from '../../services/services/token.service';
import { Subscription } from 'rxjs';
import { CartComponent } from '../../clients/panier/cart/cart.component';
import { CartService } from '../../services/services/cart/cart.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrl: './header-user.component.css'
})
export class HeaderUserComponent implements OnInit, OnDestroy {

  cartCount: number = 0;
  constructor(private readonly apiService: TokenService , private cartService : CartService) { }

  isAdmin: boolean = false;
  isAuthenticated: boolean = false;
  private authStatusSub: Subscription | null = null;
  private cartSub: Subscription | null = null;



  ngOnInit(): void {
    this.isAuthenticated = this.apiService.isAuthenticated();
    this.isAdmin = this.apiService.isAdmin();

    this.authStatusSub = this.apiService.authStatuschanged.subscribe(() => {
      this.isAuthenticated = this.apiService.isAuthenticated();
      this.isAdmin = this.apiService.isAdmin();
    })

        this.cartSub = this.cartService.cartCount$.subscribe((count:any) => {
      this.cartCount = count;
    });
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
