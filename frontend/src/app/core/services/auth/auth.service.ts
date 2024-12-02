import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, {
      withCredentials: true, // Allow cookies to be sent/received
    });
  }

  // Register method
  register(name: string, email: string, phone: number, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, phone, password }, {
      withCredentials: true, // Allow cookies to be sent/received
    });
  }

  // Refresh the access token
  refreshAccessToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, {
      withCredentials: true, // Allow cookies to be sent/received
    });
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Save access token to localStorage
  setAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  // Retrieve access token from localStorage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Logout method
  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, {
      withCredentials: true, // Send cookies to clear the refresh token server-side
    });
  }

  // Clear tokens locally after logout
  clearTokens(): void {
    localStorage.removeItem('accessToken');
  }


}
