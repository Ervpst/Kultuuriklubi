import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  gallery: any[] = [];
  @ViewChild('imageDialog') imageDialog!: TemplateRef<any>;

  apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchGallery();
  }

  fetchGallery(): void {
    this.http
      .get(`${this.apiUrl}/gallery/getGalleryPics?page=1&limit=20`)
      .subscribe({
        next: (response: any) => {
          this.gallery = response.items;
        },
        error: (err) => {
          console.error('Error fetching gallery pictures:', err);
        },
      });
  }

  openImageDialog(imagePath: string): void {
    this.dialog.open(this.imageDialog, {
      data: `${this.apiUrl}${imagePath}`, 
      panelClass: 'custom-dialog-container',
    });
  }

  trackById(_: number, item: any) {
    return item._id;
  }
}