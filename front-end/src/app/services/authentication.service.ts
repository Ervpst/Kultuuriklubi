import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
//import { environment } from '../../environments/environment';

interface AuthResponse{
  token:string
}
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = `https://kultuuriklubi.onrender.com`;
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

  isAuthenticated(): boolean {
    const token = this.loadToken();
    if (!token) return false;
  
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // seconds
      if (decoded.exp < currentTime) {
        this.logout(); // expired
        return false;
      }
      return true;
    } catch (error) {
      this.logout(); // invalid token
      return false;
    }
  }
}