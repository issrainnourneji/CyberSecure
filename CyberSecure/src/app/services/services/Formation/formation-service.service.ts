import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormationServiceService {

  private apiUrl = 'http://localhost:8080/formation';
  urlDel = 'http://localhost:8080/formation/delete';

  constructor(private http: HttpClient) {}

  getAllFormations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  addFormation(
    title: string,
    description: string,
    image: File,
    price: number,
    duration: number,
    numberOfStudents: number
  ): Observable<any> {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('price', price.toString());
    formData.append('duration', duration.toString());
    formData.append('numberOfStudents', numberOfStudents.toString());

    return this.http.post(`${this.apiUrl}/add`, formData);
  }
}
