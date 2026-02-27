import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shop } from '../models/shop';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class AdminApi {
  private baseUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) { }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials, { responseType: 'text' });
  }

  getShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${this.baseUrl}/shops`);
  }

  approveShop(id: number): Observable<Shop> {
    return this.http.put<Shop>(`${this.baseUrl}/shops/${id}/approve`, {});
  }

  rejectShop(id: number): Observable<Shop> {
    return this.http.put<Shop>(`${this.baseUrl}/shops/${id}/reject`, {});
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/employees`);
  }

  addEmployee(employee: any): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/employees`, employee);
  }

  updateEmployee(id: number, employee: any): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/employees/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/employees/${id}`);
  }

  logout(): Observable<any> {
    return this.http.get(`${this.baseUrl}/logout`, { responseType: 'text' });
  }
}