import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './gallery.component';
import { GalleryRoutingModule } from  './gallery-routing.module';
import { SharedModule } from '../shared.module'; 

@NgModule({
  declarations: [GalleryComponent],
  imports: [CommonModule, GalleryRoutingModule, SharedModule],
})
export class GalleryModule {}