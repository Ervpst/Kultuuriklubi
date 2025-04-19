import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-register', 
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';

  constructor(private authenticationService: AuthenticationService, private router: Router){}

  onSubmit(form: NgForm){
    if(form.valid){
      this.authenticationService.register(this.name, this.email, this.password)
      .subscribe({
        next: () => {
          alert('Registreerimine õnnestus! ');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registreerimine ebaõnnestus.', err);
          alert('Registration ebaõnnestus: ' + (err.error?.message || "Unknown error"));
        }
      });
    }
  }
}