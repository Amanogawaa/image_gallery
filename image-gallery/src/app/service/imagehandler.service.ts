import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImagehandlerService {
  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}
  private API_URL = 'http://localhost/gallery/gallery-api/api/';
  // private API_URL = 'http://localhost/gallery/images/uploads/1.jpg';

  loadFlowbite(callback: (flowbite: any) => void) {
    if (isPlatformBrowser(this.platformId)) {
      import('flowbite').then((flowbite) => {
        callback(flowbite);
      });
    }
  }

  check(): boolean {
    const token = sessionStorage.getItem('token');
    if (token != null) {
      return true;
    }

    return false;
  }

  //authentication
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}adduser`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}login`, data);
  }

  getCurrentUserId(): number | null {
    const mytoken = sessionStorage.getItem('token');
    if (mytoken) {
      const decodedToken = this.helper.decodeToken(mytoken);
      if (decodedToken && decodedToken.id) {
        return decodedToken.id;
      }
    }
    return null;
  }

  getUser(): string | null {
    const mytoken = sessionStorage.getItem('token');
    if (mytoken) {
      const decodedToken = this.helper.decodeToken(mytoken);
      if (decodedToken && decodedToken.username) {
        return decodedToken.username;
      }
    }
    return null;
  }

  postImage(form: FormData) {
    return this.http.post(`${this.API_URL}fileupload`, form);
  }

  updateImage(id: number, form: FormData) {
    return this.http.post(`${this.API_URL}updateimage/${id}`, form);
  }

  getImage(id: number): Observable<Blob> {
    return this.http.get<Blob>(`${this.API_URL}getimage/${id}`, {
      responseType: 'blob' as 'json',
    });
  }

  getUserImage(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}getuserimage/${id}`);
  }

  getImages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}getallimages`);
  }

  getComments(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}getimagecomment/${id}`);
  }

  getUsers(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}getusers/${id}`);
  }

  getImageDetails(id: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}getimagedetails/${id}`);
  }

  deleteImages(id: any): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}deleteimage/${id}`);
  }
}
