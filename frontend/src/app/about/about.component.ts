import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="about">
      <h2>About Us</h2>
      <p>This is a demo application showcasing Angular routing and components.</p>
    </div>
  `,
  styles: [`
    .about {
      text-align: center;
      padding: 2rem;
    }
    h2 {
      color: #333;
      margin-bottom: 1rem;
    }
  `]
})
export class AboutComponent { }