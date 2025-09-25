import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home">
      <h1>Welcome to Angular SPA</h1>
      <p>This is a simple Angular Single Page Application.</p>
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
  `]
})
export class HomeComponent { }