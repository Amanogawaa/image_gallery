import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ImagehandlerService } from '../../service/imagehandler.service';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  emailInvalid: boolean = false;
  registerForm: any;
  constructor(
    private builder: FormBuilder,
    private service: ImagehandlerService,
    private router: Router,
    private dialog: MatDialogRef<SignupComponent>
  ) {}

  ngOnInit(): void {
    this.registerForm = this.builder.group({
      username: this.builder.control('', Validators.required),
      email: this.builder.control(
        '',
        Validators.compose([Validators.required])
      ),

      password: this.builder.control('', Validators.required),
    });
  }

  registerStudent(): void {
    if (this.registerForm.valid) {
      this.service.registerUser(this.registerForm.value).subscribe(
        (result) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            },
          });
          Toast.fire({
            icon: 'success',
            title: 'Registered in successfully',
          });
          this.dialog.close();
        },
        (error) => {
          Swal.fire('Warning', `${error.error.status.message}`, 'warning');
        }
      );
    } else {
      Swal.fire('Incomplete Data', 'Please fill in all fields', 'warning');
    }
  }
}
