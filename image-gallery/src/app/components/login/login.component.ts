import { Component, OnInit } from '@angular/core';
import { ImagehandlerService } from '../../service/imagehandler.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: any;

  constructor(
    private builder: FormBuilder,
    private service: ImagehandlerService,
    private router: Router,
    private dialog: MatDialogRef<LoginComponent>
  ) {
    sessionStorage.clear();
  }

  ngOnInit(): void {
    this.loginForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  loginStudent() {
    if (this.loginForm.valid) {
      this.service.loginUser(this.loginForm.value).subscribe(
        (res: any) => {
          if (res.token) {
            sessionStorage.setItem('token', res.token);
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
              title: 'Signed in successfully',
            });
            this.dialog.close();
            this.router.navigate(['user']);
          }
        },
        (error) => {
          if (error.status == 401) {
            Swal.fire({
              title: 'Error',
              text: 'Invalid Credentials. Please try again.',
              icon: 'error',
            });
          }
          if (error.status == 404) {
            Swal.fire({
              title: 'User does not exist!',
              text: 'Please double check your entered email.',
              icon: 'error',
            });
          }
          if (error.status == 403) {
            Swal.fire({
              title: '',
              text: 'Organizer account is not activated',
              icon: 'error',
            });
          }
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Missing login credentials.',
      });
    }
  }
}
