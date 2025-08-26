import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/cart';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
  }

addToCart(formationId: number): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
  return this.http.post(`${this.apiUrl}/add/${formationId}`, {}, {headers});
}
  getMyCart(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() });
  }

  removeFromCart(formationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${formationId}`, { headers: this.getAuthHeaders() });
  }
  getNumberOfStudents(formationId: number): Observable<number> {
  return this.http.get<number>(`http://localhost:8080/cart/formation/${formationId}/students/count`);
}

}
