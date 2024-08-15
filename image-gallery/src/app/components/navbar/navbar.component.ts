import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ImagehandlerService } from '../../service/imagehandler.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isloggedin = false;
  user: any;
  username: any;

  constructor(
    private service: ImagehandlerService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.user = service.check();
    this.username = service.getUser();
  }

  ngOnInit(): void {
    this.service.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  logout() {
    Swal.fire({
      title: 'Logout?',
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
        Toast.fire({
          icon: 'success',
          title: 'Logout successfully',
        });
        sessionStorage.removeItem('token');
        this.router.navigate(['landing-page']);
      }
    });
  }

  login() {
    const dialog = this.dialog.open(LoginComponent, {
      width: '30%',
    });
  }

  signup() {
    const dialog = this.dialog.open(SignupComponent, {
      width: '30%',
    });
  }
}
