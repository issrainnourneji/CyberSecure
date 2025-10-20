import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificationService {

 private apiUrl = 'http://localhost:8080/certificat';

constructor(private http: HttpClient) { }

  getCertificationById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  generateCertification(userId: number, formationId: number): Observable<any> {
      const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
    return this.http.post(`${this.apiUrl}/generate?userId=${userId}&formationId=${formationId}`, {}, {headers});
  }

    getMyCertifications(): Observable<any[]> {
       const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
    return this.http.get<any[]>(`${this.apiUrl}/mycertifs`,{headers});
  }


}
