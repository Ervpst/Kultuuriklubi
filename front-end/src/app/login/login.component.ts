import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup; 
  errors: string[] = []; 

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    
    this.loginForm = this.fb.group({
      name: ['', [Validators.required,Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errors = [];
      const formData = this.loginForm.value;

      this.authenticationService.login(formData.name, formData.email, formData.password).subscribe({
        next: (res) => {
          this.authenticationService.saveToken(res.token); 
          alert('Sisselogimine õnnestus!');
          this.router.navigate(['/admin']); 
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

  logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }
}