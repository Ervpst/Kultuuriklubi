import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

    this.http.post('http://localhost:4201/event/createEvent', formData, {
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
  this.http.get('http://localhost:4201/event/getEvents').subscribe({
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

  this.http.delete(`http://localhost:4201/event/deleteEvent/${eventId}`, {
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

    this.http.post('http://localhost:4201/gallery/createGalleryPic', formData, {
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

    this.http.delete(`http://localhost:4201/gallery/deleteGalleryPic/${pictureId}`, {
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