// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';


import { AuthenticationService } from './services/authentication.service';
import { authGuard } from './guards/auth.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component'; 
import { ContactComponent } from './contact/contact.component';
import { GalleryComponent } from './gallery/gallery.component';  
import { AdminComponent } from './admin/admin.component';
import { LoginComponent} from './login/login.component';
import { RegisterComponent } from './register/register.component';



const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: HomeComponent }, 
  { path: 'gallery', component: GalleryComponent }, 
  { path: 'contact', component: ContactComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [authGuard]}
];

@NgModule({
    declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        AdminComponent,
        GalleryComponent,
        HomeComponent,
        ContactComponent,
    ],
    imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule
    
    
],
    providers: [AuthenticationService, provideAnimationsAsync()],
    bootstrap: [AppComponent]
})
export class AppModule { }