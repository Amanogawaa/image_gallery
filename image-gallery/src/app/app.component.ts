import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CloudinaryModule } from '@cloudinary/ng';
import { Cloudinary, CloudinaryImage } from '@cloudinary/url-gen';
import { byAngle } from '@cloudinary/url-gen/actions/rotate';
import { fill } from '@cloudinary/url-gen/actions/resize';
import {
  sepia,
  grayscale,
  cartoonify,
} from '@cloudinary/url-gen/actions/effect';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CloudinaryModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    initFlowbite();
  }
}
