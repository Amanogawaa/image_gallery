import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImagehandlerService } from '../../service/imagehandler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-viewimage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewimage.component.html',
  styleUrl: './viewimage.component.css',
})
export class ViewimageComponent implements OnInit {
  image: any;
  comments: any[] = [];
  imageDetails: any;

  constructor(
    private dialogRef: MatDialogRef<ViewimageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; src: string },
    private service: ImagehandlerService
  ) {}

  ngOnInit(): void {
    this.image = new Image();
    this.image.src = this.data.src;
    this.loadComments();
    this.getImageDetails();
  }

  getImageDetails() {
    this.service.getImageDetails(this.data.id).subscribe((res: any) => {
      this.imageDetails = res[0];
    });
  }

  loadComments(): void {
    this.service.getComments(this.data.id).subscribe((comments) => {
      this.comments = comments;
      console.log(comments);
    });
  }
}
