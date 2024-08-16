import '@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImagehandlerService } from '../../service/imagehandler.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ImageEditorDialogComponent } from '../image-editor-dialog/image-editor-dialog.component';
import { initFlowbite } from 'flowbite';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-page.component.html',
  styleUrl: './update-page.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UpdatePageComponent implements AfterViewInit, OnInit {
  userId: number | null = null;
  images: {
    id: number;
    src: string;
    aspectRatioClass?: string;
    comments?: string[];
  }[] = [];

  constructor(
    private service: ImagehandlerService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.service.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  ngOnInit(): void {
    this.userId = this.service.getCurrentUserId();
    if (this.userId) {
      this.loadImage(this.userId);
    }
  }

  ngAfterViewInit() {}

  loadImage(id: number) {
    this.service.getUserImage(id).subscribe(
      (response: any) => {
        if (response.status.remarks === 'success') {
          this.images = response.payload.map((image: any) => ({
            id: image.id,
            title: image.title,
            description: image.description,
            src: image.file_path,
          }));
          console.log('Images:', this.images);
        } else {
          Swal.fire('', response.status.message, 'info');
        }
      },
      (error) => {
        console.error('Error loading user images:', error);
      }
    );
  }

  deleteImage(id: number) {
    Swal.fire({
      title: 'Delete this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        this.service.deleteImages(id).subscribe(
          (res) => {
            Toast.fire({
              icon: 'success',
              title: 'Post deleted successfully',
            });
            this.loadImage(this.userId!);
          },
          (error) => {
            Toast.fire({
              icon: 'error',
              title: 'Delete post failed',
            });
            console.error('Delete failed', error);
          }
        );
      }
    });
  }

  updateImage(id: number, src: string) {
    const dialog = this.dialog.open(ImageEditorDialogComponent, {
      data: { id: id, src: src },
      width: '55%',
      height: '96%',
      disableClose: true,
    });

    dialog.afterClosed().subscribe((result) => {
      this.loadImage(this.userId!);
    });
  }
}
