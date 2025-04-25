import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  eventName = '';
  eventDescription = '';
  eventDate: string = '';
  eventTime: string = '';
  selectedFile: File | null = null;
  events: any[] = [];

  galleryName = '';
  selectedGalleryFile: File | null = null;
  gallery: any[] = [];

  constructor(private http: HttpClient) {}

  // event file selection
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // gallery file selection
  onGalleryFileSelected(event: any): void {
    this.selectedGalleryFile = event.target.files[0];
  }

  // Create event
  createEvent(): void {
    if (!this.selectedFile) {
      alert('Vali palun kaanepilt.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.eventName);
    formData.append('description', this.eventDescription);
    formData.append('date', this.eventDate);
    formData.append('time', this.eventTime);
    formData.append('coverPicture', this.selectedFile);
    const token = localStorage.getItem('jwt');

    this.http.post('http://localhost:4201/event/createEvent', formData, {
        headers: { Authorization: `Bearer ${token}` },
      }).subscribe({
      next: (response: any) => {
        alert('Üritus lisati edukalt!');
        this.fetchEvents();
      },
      error: (err) => {
        console.error('Error in creating event:', err);
        alert('Ei saanud üritust luua.');
      },
    });
  }

  //All events
  fetchEvents(): void {
    this.http.get('http://localhost:4201/event/getEvents').subscribe({
      next: (response: any) => {
        this.events = response;
      },
      error: (err) => {
        console.error('Error in fetching event:', err);
      },
    });
  }
  //Delete event
  deleteEvent(eventId: string): void {
    const token = localStorage.getItem('jwt'); 
  
    this.http
      .delete(`http://localhost:4201/event/deleteEvent/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }, 
      })
      .subscribe({
        next: () => {
          alert('Üritus kustutati!');
          this.fetchEvents(); 
        },
        error: (err) => {
          console.error('Error ürituse kustutamisega:', err);
          alert('Error event deletion.');
        },
      });
  }

  // Upload a gallery picture
  uploadGalleryPicture(): void {
    if (!this.selectedGalleryFile) {
      alert('Vali galerii pilt.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.galleryName);
    formData.append('galleryPicture', this.selectedGalleryFile);
    const token = localStorage.getItem('jwt'); 

    this.http.post('http://localhost:4201/gallery/createGalleryPic', formData, {
      headers: { Authorization: `Bearer ${token}` }, 
    }).subscribe({
      next: (response: any) => {
        alert('Pilt lisati galeriisse edukalt!');
        this.fetchGallery();
      },
      error: (err) => {
        console.error('Error picture loading:', err);
        alert('Pilti ei saanud ülesse laadida.');
      },
    });
  }

  // Get all pictures
  fetchGallery(): void {
    this.http.get('http://localhost:4201/gallery/getGalleryPics').subscribe({
      next: (response: any) => {
        this.gallery = response;
      },
      error: (err) => {
        console.error('Error fetching gallery pictures:', err);
      },
    });
  }

  // Delete picture
  deleteGalleryPicture(pictureId: string): void {
    const token = localStorage.getItem('jwt'); 

    this.http
      .delete(`http://localhost:4201/gallery/deleteGalleryPic/${pictureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: () => {
          alert('Pilt kustutati edukalt!');
          this.fetchGallery();
        },
        error: (err) => {
          console.error('Error deleting picture:', err);
          alert('Pilti ei saanud kustutada.');
        },
      });
  }

  // Get events and gallery 
  ngOnInit(): void {
    this.fetchEvents();
    this.fetchGallery();
  }
}