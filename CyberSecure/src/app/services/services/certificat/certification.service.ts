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
countCertifications() {
  return this.http.get<number>(`${this.apiUrl}/count`);
}
getAllCertifications(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/all`);
}
  getCertificationsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
getCertificationsByUserAndFormation(userId: number, formationId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/formation/${formationId}`);
}

updateCertification(id: number, cert: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  });
  return this.http.put(`${this.apiUrl}/update/${id}`, cert, { headers });
}


deleteCertification(certId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/delete/${certId}`);
}


}
