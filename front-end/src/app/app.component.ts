import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-end';
  constructor(private authService: AuthenticationService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  logout(): void {
    this.authService.logout();
  }
  ngOnInit(): void {
    // Auth stat check
    setInterval(() => {
      this.authService.isAuthenticated();
    }, 5000); //  5 seconds
  }
}