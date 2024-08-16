import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ImagehandlerService } from '../../service/imagehandler.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-image-editor-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './image-editor-dialog.component.html',
  styleUrl: './image-editor-dialog.component.css',
})
export class ImageEditorDialogComponent {
  image: HTMLImageElement | null = null;
  canvas!: HTMLCanvasElement;
  canvasCtx!: CanvasRenderingContext2D;
  settings: { [key: string]: string } = {
    brightness: '100',
    saturation: '100',
    blur: '0',
    inversion: '0',
  };

  form: any;
  imageDetails: any;
  file: any;
  imagePreview?: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<ImageEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; src: string },
    private service: ImagehandlerService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.service.getImageDetails(this.data.id).subscribe((response: any) => {
      this.imageDetails = response[0];
      console.log('Image details:', this.imageDetails);

      if (this.imageDetails != null) {
        this.form.patchValue({
          title: this.imageDetails.title,
          description: this.imageDetails.description,
        });
      }
    });

    this.image = new Image();
    this.image.crossOrigin = 'Anonymous ';

    this.image.onload = () => {
      this.initializeCanvas();
      this.resetSettings();
      this.renderImage();
    };

    this.image.onerror = (error) => {
      console.error('Error loading image:', error);
    };

    this.image.src = this.data.src;
  }

  initializeCanvas() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.canvasCtx = this.canvas.getContext('2d')!;
  }

  resetSettings() {
    Object.keys(this.settings).forEach((key) => {
      const input = document.getElementById(key) as HTMLInputElement | null;
      if (input) {
        input.value = this.settings[key];
      }
    });
    this.renderImage();
  }

  updateSetting(key: string, event: Event) {
    if (!this.image) return;
    const target = event.target as HTMLInputElement;
    if (target) {
      this.settings[key] = target.value;
      this.renderImage();
    }
  }

  generateFilter() {
    const { brightness, saturation, blur, inversion } = this.settings;
    return `brightness(${brightness}%) saturate(${saturation}%) blur(${blur}px) invert(${inversion}%)`;
  }

  renderImage() {
    if (this.image && this.canvasCtx) {
      this.canvas.width = this.image.width;
      this.canvas.height = this.image.height;

      this.canvasCtx.filter = this.generateFilter();
      this.canvasCtx.drawImage(this.image, 0, 0);
    }
  }

  convertCanvasToBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (this.canvas) {
        this.canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        }, 'image/png');
      } else {
        reject(new Error('Canvas not available'));
      }
    });
  }

  async saveChanges() {
    try {
      const blob = await this.convertCanvasToBlob();
      const formData = new FormData();
      formData.append('file', blob, 'edited-image.png');

      if (this.form.value.title && this.form.value.description) {
        formData.append('title', this.form.value.title);
        formData.append('description', this.form.value.description);
      }

      this.service.updateImage(this.data.id, formData).subscribe(
        (response) => {
          console.log('Image updated successfully', response);
          Swal.fire('Success', 'Image updated successfully', 'success');
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error updating image:', error);
        }
      );
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  }

  cancelEdit() {
    this.dialogRef.close();
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
      if (this.imagePreview) {
        this.image = new Image();
        this.image.onload = () => {
          this.initializeCanvas();
          this.renderImage();
        };
        this.image.src = this.imagePreview as string;
      }
    };
    reader.readAsDataURL(this.file);
  }

  deleteImage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.imagePreview = null;
    this.file = null;

    if (this.image) {
      this.image.src = this.data.src;
      this.image.onload = () => {
        this.initializeCanvas();
        this.resetSettings();
        this.renderImage();
      };
    }
  }
}
