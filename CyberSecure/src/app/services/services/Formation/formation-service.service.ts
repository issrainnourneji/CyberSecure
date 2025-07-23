import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormationServiceService {

  private apiUrl = 'http://localhost:8080/formation';

  constructor(private http: HttpClient) {}

  getAllFormations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
  getFormationById(id: number): Observable<any> {
  return this.http.get<any[]>(`${this.apiUrl}/get/${id}`)
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

    deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  updateFormation(
  id: number,
  title: string,
  description: string,
  image: File | null,
  price: number,
  duration: number,
  numberOfStudents: number
): Observable<any> {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  if (image) {
    formData.append('image', image);
  }
  formData.append('price', price.toString());
  formData.append('duration', duration.toString());
  formData.append('numberOfStudents', numberOfStudents.toString());

  return this.http.put(`${this.apiUrl}/update/${id}`, formData);
}


}
