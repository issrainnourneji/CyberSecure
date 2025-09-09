import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Slidehtml {
  id?: number;
  htmlContent: string;
}
@Injectable({
  providedIn: 'root'
})
export class SlidehtmlService {
private apiUrl = 'http://localhost:8080/slidehtml';

  constructor(private http: HttpClient) {}

  addSlide(slide: Slidehtml): Observable<Slidehtml> {
    return this.http.post<Slidehtml>(this.apiUrl, slide);
  }

  getSlides(): Observable<Slidehtml[]> {
    return this.http.get<Slidehtml[]>(this.apiUrl);
  }
}
