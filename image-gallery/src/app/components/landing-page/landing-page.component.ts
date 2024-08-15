import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ImagehandlerService } from '../../service/imagehandler.service';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css',
})
export class LandingPageComponent implements OnInit {
  images: { src: string; aspectRatioClass?: string; comments?: string[] }[] =
    [];
  selectedImageIndex: number | null = null;
  newComment: string = '';
  objectURLS: any[] = [];

  constructor(
    private service: ImagehandlerService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllImages();
  }

  ngOnDestroy(): void {
    this.objectURLS.forEach((url) => URL.revokeObjectURL(url));
  }

  loadImages(id: number): void {
    this.service.getImage(id).subscribe((blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      this.objectURLS.push(url);
      img.onload = () => {
        const aspectRatioClass = this.getAspectRatioClass(
          img.width,
          img.height
        );
        this.images.push({
          src: url,
          aspectRatioClass,
          comments: [],
        });
      };
      img.src = url;
    });
  }

  getAllImages(): void {
    this.service
      .getImages()
      .subscribe((imageData: { id: number; file_path: string }[]) => {
        imageData.forEach((image) => {
          this.loadImages(image.id);
        });
      });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const aspectRatioClass = this.getAspectRatioClass(
            img.width,
            img.height
          );
          this.images.push({
            src: e.target.result,
            aspectRatioClass,
            comments: [],
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getAspectRatioClass(width: number, height: number): string {
    const aspectRatio = width / height;

    if (aspectRatio < 0.67) {
      return 'tall';
    } else if (aspectRatio > 0.8 && aspectRatio < 1) {
      return 'slightly-wide-portrait';
    } else if (Math.abs(aspectRatio - 1) < 0.2) {
      return 'nearly-square';
    } else {
      return '';
    }
  }

  openImage(index: number): void {
    this.selectedImageIndex = index;
  }
}
