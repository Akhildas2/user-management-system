import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, {
      withCredentials: true, // Send cookies with the request if needed (e.g., session cookies)
    });
  }

  // Register method
  register(name: string, email: string, phone: number, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, phone, password }, {
      withCredentials: true, // Send cookies with the request if needed (e.g., session cookies)
    });
  }

  // Refresh the access token
  refreshAccessToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, {
      withCredentials: true, // Include cookies when refreshing token
    });
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
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
      withCredentials: true, // Include cookies when logging out, if the server clears the session cookies
    });
  }

  // Clear tokens locally after logout
  clearTokens(): void {
    localStorage.removeItem('accessToken');
  }
}
