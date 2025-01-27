import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { IUser } from '../../../shared/models/userModel';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/api/admin`
  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUser[]> {
    return this.http.get<{ status: string; data: IUser[] }>(this.baseUrl).pipe(
      map(response=>response.data)
    )
  }

  getUserById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.baseUrl}/${id}`)
  }

  createUser(user: Partial<IUser>): Observable<IUser> {
    return this.http.post<IUser>(this.baseUrl, user);
  }

  updateUser(user: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${this.baseUrl}/${user._id}`, user)
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
  }
}
