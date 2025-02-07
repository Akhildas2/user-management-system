import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { IUser } from '../../../shared/models/userModel';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.adminApiUrl}`
  
  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUser[]> {
    return this.http.get<{ status: string; data: IUser[] }>(`${this.baseUrl}/users`).pipe(
      map(response => response.data)
    )
  }

  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/user/${id}`)
  }

  createUser(user: FormData): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}/user`, user);
  }

  updateUser( user: FormData): Observable<IUser> {
    return this.http.put<IUser>(`${this.baseUrl}/user`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/user/${id}`)
  }
}
