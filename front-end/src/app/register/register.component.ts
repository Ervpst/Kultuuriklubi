import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup; 
  errors: string[] = []; 

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required,Validators.minLength(3)],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.errors = []; 
      const formData = this.registerForm.value;

      this.authenticationService.register(formData.name, formData.email, formData.password).subscribe({
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
        },
      });
    }
  }
}