import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errors: string[] = []; 

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.errors = []; 
      this.authenticationService.login(this.name, this.email, this.password).subscribe({
        next: (res) => {
          this.authenticationService.saveToken(res.token);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login ebaõnnestus.', err);

          // Validations eerrors
          if (err.status === 422 && err.error.errors) {
            this.errors = err.error.errors.map((e: any) => `${e.param}: ${e.msg}`); 
          } else if (err.status === 400 && err.error.error) {
            this.errors = [err.error.error]; //Specific error message 
          } else {
            this.errors = ['Tundmatu viga, proovi uuesti.'];
          }
        },
      });
    }
  }
  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }
}