// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthenticationService } from './authentication.service';
//import { AppRoutingModule } from './app-routing.module';

import { HomeComponent } from './home/home.component'; 
import { ContactComponent } from './contact/contact.component'; 
import { LoginComponent} from './login/login.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to '/home' route
  { path: 'home', component: HomeComponent }, 
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent}
];

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule ,
        RouterModule.forRoot(routes),
        FormsModule,
        HomeComponent, 
        ContactComponent, 
        
        
        
    ],
    providers: [AuthenticationService],
    bootstrap: [AppComponent]
})
export class AppModule { }