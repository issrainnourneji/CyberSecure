import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

    authStatuschanged = new EventEmitter<void>();

  private static BASE_URL = 'http://localhost:8080';

    private getHeader():HttpHeaders{
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

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

    getAllUsers(): Observable<any> {
    return this.http.get(`${TokenService.BASE_URL}/user/get-all`);
  }

    deleteUser(userId: number): Observable<any> {
    const token = localStorage.getItem('token');  // Get the token from local storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${TokenService.BASE_URL}/user/del/${userId}`);
  }

    getLoggedInUserInfo(): Observable<any> {
    return this.http.get(`${TokenService.BASE_URL}/user/my-info`, {
      headers: this.getHeader()
    })
  }

    UpdateUser(data: any): Observable<any> {
      return this.http.put<any>(`${TokenService.BASE_URL}/user/up/${data.id}`, data);
    }

  requestPasswordReset(email: string) {
    return this.http.post<any>(`${TokenService.BASE_URL}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    const payload = { token, newPassword };
    return this.http.post<any>(`${TokenService.BASE_URL}/auth/reset-password`, payload);
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
