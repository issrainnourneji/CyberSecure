import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
 private apiUrl = 'http://localhost:8080/contact'; // ton endpoint backend

  constructor(private http: HttpClient) {}

  sendMessage(contact: any): Observable<string> {
    return this.http.post(this.apiUrl, contact, { responseType: 'text' });
  }
}
