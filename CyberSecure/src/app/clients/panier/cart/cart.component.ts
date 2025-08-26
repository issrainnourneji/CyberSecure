import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/services/cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getMyCart().subscribe({
      next: data => this.cartItems = data,
      error: err => console.error(err)
    });
  }

removeItem(formationId: number) {
  this.cartService.removeFromCart(formationId).subscribe({
    next: () => {
      alert('Formation supprimée du panier');
      this.loadCart();
    },
    error: err => {
      console.error(err);
      alert(err.error?.message || 'Impossible de supprimer la formation');
    }
  });
}

}
