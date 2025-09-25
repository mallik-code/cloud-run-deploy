import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="nav-brand">Angular SPA</div>
      <div class="nav-links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <a routerLink="/about" routerLinkActive="active">About</a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #333;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand {
      color: white;
      font-size: 1.5rem;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      margin-left: 1rem;
      padding: 0.5rem;
    }
    .nav-links a:hover {
      background-color: #555;
      border-radius: 4px;
    }
    .active {
      background-color: #555;
      border-radius: 4px;
    }
  `]
})
export class NavbarComponent { }