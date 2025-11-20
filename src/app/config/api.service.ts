import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getusers() {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }
}
