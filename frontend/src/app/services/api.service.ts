import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8085';

  constructor(private http: HttpClient) { }

  getData(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl);
  }
}