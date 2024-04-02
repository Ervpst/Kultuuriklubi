// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component'; // Import HomeComponent
import { ContactComponent } from './contact/contact.component'; // Import ContactComponent

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to '/home' route
  { path: 'home', component: HomeComponent }, // Add home route
  { path: 'contact', component: ContactComponent }, // Add contact route
];

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        HomeComponent, // Import HomeComponent
        ContactComponent, // Import ContactComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }