import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  gallery: any[] = [];
  @ViewChild('imageDialog') imageDialog!: TemplateRef<any>;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

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

  openImageDialog(imageUrl: string): void {
    this.dialog.open(this.imageDialog, {
      data: imageUrl,
      panelClass: 'custom-dialog-container',
    });
  }
}