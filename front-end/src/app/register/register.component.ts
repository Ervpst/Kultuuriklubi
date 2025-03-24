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
          alert('Registration successful! Please log in.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed.', err);
          alert('Registration failed: ' + (err.error?.message || "Unknown error"));
        }
      });
    }
  }
}