// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component'; 
import { ContactComponent } from './contact/contact.component'; 
import {LoginComponent} from './login/login.component'

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to '/home' route
  { path: 'home', component: HomeComponent }, 
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        HomeComponent, 
        ContactComponent, 
        LoginComponent,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }