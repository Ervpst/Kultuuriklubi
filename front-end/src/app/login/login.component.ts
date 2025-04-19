import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',

})
export class LoginComponent {

  name = '';
  email = '';
  password = '';

  constructor(private authenticationService: AuthenticationService, private router: Router){}

  onSubmit(form: NgForm){
    if(form.valid){
      this.authenticationService.login(this.name, this.email, this.password)
      .subscribe({
        next:(res)=>{
          this.authenticationService.saveToken(res.token);
          this.router.navigate(['/home']);
        },
       error: (err)=>{
        console.error('Logimine ebaõnnestus: ', err);
        alert('Logimine ebaõnnestus '+ (err.error.error)|| 'Vaata andmed üle')
       }
      });
    }
  }
  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  
}