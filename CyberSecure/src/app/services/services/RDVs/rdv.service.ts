import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RDVDto } from '../../models/rdv';

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

  getMyAppointments(): Observable<RDVDto[]> {
    return this.http.get<RDVDto[]>(`${this.apiUrl}/my`,  {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  getAllAppointments(): Observable<RDVDto[]> {
    return this.http.get<RDVDto[]>(`${this.apiUrl}/all`);
  }
}
