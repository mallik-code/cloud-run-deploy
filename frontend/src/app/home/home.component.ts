import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="home">
      <h1>Welcome to Angular SPA</h1>
      <div class="api-data" *ngIf="apiData">
        <h2>API Response:</h2>
        <pre>{{ apiData | json }}</pre>
      </div>
      <div class="error" *ngIf="error">
        {{ error }}
      </div>
      <div class="loading" *ngIf="loading">
        Loading...
      </div>
    </div>
  `,
  styles: [`
    .home {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      color: #333;
      margin-bottom: 1rem;
    }
    .api-data {
      margin-top: 2rem;
      text-align: left;
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .error {
      color: red;
      margin-top: 1rem;
    }
    .loading {
      margin-top: 1rem;
      font-style: italic;
    }
  `]
})
export class HomeComponent implements OnInit {
  apiData: any;
  error: string = '';
  loading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getData().subscribe({
      next: (data) => {
        this.apiData = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error fetching data from API: ' + error.message;
        this.loading = false;
      }
    });
  }
}