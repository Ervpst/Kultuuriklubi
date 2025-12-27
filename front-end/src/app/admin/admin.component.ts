import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment.prod';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  eventForm: FormGroup; 
  galleryForm: FormGroup; 
  selectedEventFile: File | null = null; 
  selectedGalleryFile: File | null = null; 
  events: any[] = []; 
  gallery: any[] = []; 
  apiUrl = `${environment.apiUrl}`;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
    });

    
    this.galleryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }
  // Get events and gallery 
  ngOnInit(): void {
    this.fetchEvents(); 
    this.fetchGallery(); 
  }

  // event file selection
  onEventFileSelected(event: any): void {
    this.selectedEventFile = event.target.files[0];
  }

  // gallery file selection
  onGalleryFileSelected(event: any): void {
    this.selectedGalleryFile = event.target.files[0];
  }

  // Create event
  createEvent(): void {
    if (!this.selectedEventFile) {
      alert('Vali palun kaanepilt.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.eventForm.get('name')?.value);
    formData.append('description', this.eventForm.get('description')?.value);
    formData.append('date', this.eventForm.get('date')?.value);
    formData.append('time', this.eventForm.get('time')?.value);
    formData.append('coverPicture', this.selectedEventFile);

    const token = localStorage.getItem('jwt');

    this.http.post(`${environment.apiUrl}/event/createEvent`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: () => {
        alert('Üritus lisati edukalt!');
        this.eventForm.reset(); 
        this.selectedEventFile = null; 
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
  this.http.get(`${environment.apiUrl}/event/getEvents`).subscribe({
    next: (response: any) => {
      this.events = response;
    },
    error: (err) => {
      console.error('Error in fetching event:', err);
    },
  });
}

// Delete event
deleteEvent(eventId: string): void {
  const token = localStorage.getItem('jwt');

  this.http.delete(`${environment.apiUrl}/event/deleteEvent/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).subscribe({
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
    formData.append('name', this.galleryForm.get('name')?.value);
    formData.append('galleryPicture', this.selectedGalleryFile);

    const token = localStorage.getItem('jwt');

    this.http.post(`${environment.apiUrl}/gallery/createGalleryPic`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
      next: () => {
        alert('Pilt lisati galeriisse edukalt!');
        this.galleryForm.reset(); 
        this.selectedGalleryFile = null; 
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
    this.http.get(`${environment.apiUrl}/gallery/getGalleryPics`).subscribe({
      next: (response: any) => {
        this.gallery = response.items ?? [];
      },
      error: (err) => {
        console.error('Error fetching gallery pictures:', err);
        this.gallery = [];
      },
    });
  }

  // Delete picture
  deleteGalleryPicture(pictureId: string): void {
    const token = localStorage.getItem('jwt');

    this.http.delete(`${environment.apiUrl}/gallery/deleteGalleryPic/${pictureId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe({
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
}