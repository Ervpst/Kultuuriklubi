import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  gallery: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchGallery();
  }

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
}