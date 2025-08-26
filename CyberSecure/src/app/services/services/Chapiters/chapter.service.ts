import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {

private apiUrl = 'http://localhost:8080/chapitre';


  constructor(private http: HttpClient) {}

  addChapitre(formationId: number, titre: string): Observable<any> {
    const formData = new FormData();
    formData.append('titre', titre);
    return this.http.post(`${this.apiUrl}/add/${formationId}`, formData);
  }

  updateChapitre(id: number, titre: string): Observable<any> {
  const formData = new FormData();
  formData.append('titre', titre);
  return this.http.put(`${this.apiUrl}/update/${id}`, formData);
}

  deleteChapitre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getChapitreById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
}

getChapitresByFormation(formationId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/formation/${formationId}`);
  }


}
