import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImagehandlerService } from '../../service/imagehandler.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-viewimage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viewimage.component.html',
  styleUrl: './viewimage.component.css',
})
export class ViewimageComponent implements OnInit {
  image: any;
  comments: any[] = [];
  imageDetails: any;
  form: any;

  constructor(
    private dialogRef: MatDialogRef<ViewimageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; src: string },
    private service: ImagehandlerService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      content: [''],
    });
  }

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
    this.service.getComments(this.data.id).subscribe((comments: any) => {
      this.comments = comments.payload;
      console.log(this.comments);
      ``;
    });
  }

  addComment() {
    const data = {
      image_id: this.data.id,
      user_id: this.service.getCurrentUserId(),
      content: this.form.value.content,
    };

    this.service.addComment(data).subscribe((res) => {
      this.loadComments();
      this.form.get('content')?.reset();
    });
  }
}
