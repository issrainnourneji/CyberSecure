import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RdvService {
  private apiUrl = 'http://localhost:8080/rdv';

  constructor(private http: HttpClient) { }

    addRdv(appointment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, appointment, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
