// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthenticationService } from './authentication.service';
import { authGuard } from './auth.guard';
//import { AppRoutingModule } from './app-routing.module';

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
  { path: 'register', component: RegisterComponent}
];

@NgModule({ declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        AdminComponent,
        GalleryComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        RouterModule.forRoot(routes),
        FormsModule,
        HomeComponent,
        ContactComponent], providers: [AuthenticationService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }