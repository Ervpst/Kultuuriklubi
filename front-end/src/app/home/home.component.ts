import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  events: any[] = []; 
  currentIndex: number = 0; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.http.get<any[]>('http://localhost:4201/event/getEvents').subscribe({
      next: (response) => {
        // sort by date decreasing
        this.events = response.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // event closest to now
        const now = new Date().getTime();
        this.currentIndex = this.events.findIndex(event => new Date(event.date).getTime() >= now);

        
        if (this.currentIndex === -1) {
          this.currentIndex = this.events.length - 1;
        }
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
    });
  }

  previousEvent(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextEvent(): void {
    if (this.currentIndex < this.events.length - 1) {
      this.currentIndex++;
    }
  }
}