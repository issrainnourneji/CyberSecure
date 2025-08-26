import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlideService {

  private apiUrl = 'http://localhost:8080/slide';

  constructor(private http: HttpClient) {}

  getSlides(chapitreId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${chapitreId}`);
  }

  addSlide(chapitreId: number, slide: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add/${chapitreId}`, slide);
  }

  getAllSlides(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
