import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface AuthResponse{
  token:string
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://localhost:4201/user';
  token: string|null = null;

  constructor(
    private http: HttpClient, private router: Router
  ) { }

  register(name: string, email:string, password: string){
    return this.http.post(`${this.apiUrl}/signup`, {name, email, password});
  }


  logout(){
    this.token=null;
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  login(name: string, email: string, password: string){
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {name, email, password});
  }

  saveToken(token: string){
    this.token = token;
    localStorage.setItem('jwt', token);
  }

  loadToken(){
    const token = localStorage.getItem('jwt');
    if(token) this.token = token;
    return this.token;
  }

  isAuthenticated(){
    return !!this.loadToken();
  }
}