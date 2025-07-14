import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

    authStatuschanged = new EventEmitter<void>();

  private static BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

   registerUser(registration: any): Observable<any>{
    return this.http.post(`${TokenService.BASE_URL}/auth/register`, registration);
  }

    loginUser(loginDetails: any): Observable<any>{
    return this.http.post(`${TokenService.BASE_URL}/auth/login`, loginDetails);
  }

  logout():void{
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }

    isAuthenticated():boolean{
      const token = localStorage.getItem('token')
      return !!token;
    }

    isAdmin():boolean {
      const role = localStorage.getItem('role')
      return role === 'ADMIN';
    }
    isClient():boolean {
      const role = localStorage.getItem('role')
      return role === 'USER';
    }

}
