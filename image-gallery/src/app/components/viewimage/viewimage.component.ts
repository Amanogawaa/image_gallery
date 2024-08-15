import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-viewimage',
  standalone: true,
  imports: [],
  templateUrl: './viewimage.component.html',
  styleUrl: './viewimage.component.css',
})
export class ViewimageComponent {
  constructor(
    private dialogRef: MatDialogRef<ViewimageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    console.log('Data:', this.data);
  }
}
