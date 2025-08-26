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

  confirmRDV(id: number): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/confirm/${id}`,
    {},
    {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    }
  );
}

updateRDV(id: number, payload: any) {
  return this.http.put<any>(`${this.apiUrl}/update/${id}`, payload ,  {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
}


  deleteRDV(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`,  {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

}
