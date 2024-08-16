import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImagehandlerService } from '../../service/imagehandler.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.css',
})
export class CreatePageComponent implements OnInit {
  file: any;
  imagePreview?: string | ArrayBuffer | null = null;
  user_id: any;
  selectedImageId: number | null = null;
  imageForm: any;

  images: {
    id: number;
    src: string;
    aspectRatioClass?: string;
    comments?: string[];
  }[] = [];
  objectURLS: any[] = [];

  constructor(
    private service: ImagehandlerService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user_id = this.service.getCurrentUserId();
    if (this.user_id !== null) {
      this.getUserImages(this.user_id);
    }

    this.imageForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  getUserImages(id: number): void {
    this.service.getUserImage(id).subscribe(
      (response: any) => {
        if (response.status.remarks === 'success') {
          this.images = response.payload.map((image: any) => ({
            id: image.id,
            src: image.file_path,
            comments: [],
          }));
        } else {
          Swal.fire('', response.status.message, 'info');
        }
      },
      (error) => {
        console.error('Error loading user images:', error);
      }
    );
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;
    if (files.length > 0) {
      this.file = files[0];
      this.previewImage();
    }
  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result;
    };
    reader.readAsDataURL(this.file);
  }

  uploadImage() {
    if (!this.file || !this.imageForm.valid)
      return Swal.fire(
        '',
        'Please select an image and fill in all fields',
        'info'
      );

    const formData = new FormData();
    formData.append('file', this.file);

    if (this.user_id !== null) {
      formData.append('user_id', this.user_id.toString());
    }

    if (this.imageForm.value.title && this.imageForm.value.description) {
      formData.append('title', this.imageForm.value.title);
      formData.append('description', this.imageForm.value.description);
    }

    this.service.postImage(formData).subscribe(
      (response: any) => {
        Swal.fire('', 'Upload successful', 'success');

        this.file = null;
        this.imagePreview = null;
        (
          document.querySelector('input[type="file"]') as HTMLInputElement
        ).value = '';

        this.imageForm.get('title')?.reset();
        this.imageForm.get('description')?.reset();
        this.getUserImages(this.user_id);
      },
      (error) => {
        Swal.fire('', 'Upload failed', 'error');
        console.error('Upload failed', error);
      }
    );

    return;
  }
}
