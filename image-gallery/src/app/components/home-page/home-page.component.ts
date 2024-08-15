import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImagehandlerService } from '../../service/imagehandler.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ViewimageComponent } from '../viewimage/viewimage.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  images: {
    id: number;
    title: string;
    description: string;
    src: string;
    aspectRatioClass?: string;
    comments?: string[];
  }[] = [];
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

  loadImages(id: number, title: string, description: string): void {
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
          id,
          title,
          description,
          src: url,
          aspectRatioClass,
          comments: [],
        });
        console.log(this.images);
      };
      img.src = url;
    });
  }

  getAllImages(): void {
    this.service.getImages().subscribe(
      (
        imageData: {
          title: string;
          description: string;
          id: number;
          file_path: string;
        }[]
      ) => {
        imageData.forEach((image) => {
          this.loadImages(image.id, image.title, image.description);
        });
      }
    );
  }

  // onFileSelected(event: any): void {
  //   const files = event.target.files;
  //   for (const file of files) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         const aspectRatioClass = this.getAspectRatioClass(
  //           img.width,
  //           img.height
  //         );
  //         this.images.push({
  //           title: '',
  //           description: '',
  //           src: e.target.result,
  //           aspectRatioClass,
  //           comments: [],
  //         });
  //       };
  //       img.src = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

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

  openImageDialog(id: number): void {
    this.dialog.open(ViewimageComponent, {
      data: { id: id },
    });
  }
}
