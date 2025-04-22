import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errors: string[] = []; 

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.errors = []; 
      this.authenticationService.register(this.name, this.email, this.password).subscribe({
        next: () => {
          alert('Registreerimine õnnestus!');
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Registreerimine ebaõnnestus.', err);

          // Validations errors
          if (err.status === 422 && err.error.errors) {
            this.errors = err.error.errors.map((e: any) => `${e.param}: ${e.msg}`); 
          } else {
            this.errors = [err.error?.message || 'Tundmatu viga, proovi uuesti'];
          }
        }
      });
    }
  }
}