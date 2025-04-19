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

  // Handle file selection for events
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Handle file selection for gallery
  onGalleryFileSelected(event: any): void {
    this.selectedGalleryFile = event.target.files[0];
  }

  // Create event
  createEvent(): void {
    if (!this.selectedFile) {
      alert('Please select a cover picture.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.eventName);
    formData.append('description', this.eventDescription);
    formData.append('date', this.eventDate);
    formData.append('time', this.eventTime);
    formData.append('coverPicture', this.selectedFile);

    this.http.post('http://localhost:4201/event/createEvent', formData).subscribe({
      next: (response: any) => {
        alert('Event created successfully!');
        this.fetchEvents();
      },
      error: (err) => {
        console.error('Error creating event:', err);
        alert('Failed to create event.');
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
        console.error('Error fetching events:', err);
      },
    });
  }
  //Delete event
  deleteEvent(eventId: string): void {
    this.events = this.events.filter(event => event._id !== eventId);
    console.log(`Event with ID ${eventId} has been deleted.`);
  }

  // Upload a gallery picture
  uploadGalleryPicture(): void {
    if (!this.selectedGalleryFile) {
      alert('Please select a gallery picture.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.galleryName);
    formData.append('galleryPicture', this.selectedGalleryFile);

    this.http.post('http://localhost:4201/gallery/createGalleryPic', formData).subscribe({
      next: (response: any) => {
        alert('Gallery picture uploaded successfully!');
        this.fetchGallery();
      },
      error: (err) => {
        console.error('Error uploading gallery picture:', err);
        alert('Failed to upload gallery picture.');
      },
    });
  }

  // Fetch all gallery pictures
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

  // Delete icture
  deleteGalleryPicture(pictureId: string): void {
    const token = localStorage.getItem('jwt'); 

    this.http
      .delete(`http://localhost:4201/gallery/deleteGalleryPic/${pictureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: () => {
          alert('Gallery picture deleted successfully!');
          this.fetchGallery();
        },
        error: (err) => {
          console.error('Error deleting gallery picture:', err);
          alert('Failed to delete gallery picture.');
        },
      });
  }

  // Get events and gallery 
  ngOnInit(): void {
    this.fetchEvents();
    this.fetchGallery();
  }
}