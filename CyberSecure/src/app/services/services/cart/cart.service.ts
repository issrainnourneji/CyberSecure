import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/cart';

    private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
     this.loadCartCount();
   }

  private getAuthHeaders() {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
  }

addToCart(formationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add/${formationId}`, {}, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => this.loadCartCount()) // met à jour le compteur après ajout
      );
  }

  getMyCart(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() });
  }

  removeFromCart(formationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${formationId}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => this.loadCartCount()) // met à jour le compteur après suppression
      );
  }


  getNumberOfStudents(formationId: number): Observable<number> {
  return this.http.get<number>(`http://localhost:8080/cart/formation/${formationId}/students/count`);
}
loadCartCount() {
    this.getMyCart().subscribe({
      next: (data) => this.cartCountSubject.next(data.length),
      error: (err) => console.error('Impossible de charger le compteur du panier', err)
    });
  }
}
