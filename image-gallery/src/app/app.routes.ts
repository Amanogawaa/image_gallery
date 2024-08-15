import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { authGuardGuard } from './guard/auth-guard.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full',
  },

  {
    path: 'landing-page',
    loadComponent: () =>
      import('./components/landing-page/landing-page.component').then(
        (e) => e.LandingPageComponent
      ),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then(
        (c) => c.SignupComponent
      ),
  },

  {
    path: 'user',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'home-page',
        pathMatch: 'full',
      },

      {
        path: 'home-page',
        loadComponent: () =>
          import('./components/home-page/home-page.component').then(
            (e) => e.HomePageComponent
          ),
        canActivate: [authGuardGuard],
      },

      {
        path: 'create-page',
        loadComponent: () =>
          import('./components/create-page/create-page.component').then(
            (e) => e.CreatePageComponent
          ),
        canActivate: [authGuardGuard],
      },

      {
        path: 'collection-page',
        loadComponent: () =>
          import('./components/update-page/update-page.component').then(
            (e) => e.UpdatePageComponent
          ),
        children: [
          {
            path: 'image-editor-dialog/:id',
            loadComponent: () =>
              import(
                './components/image-editor-dialog/image-editor-dialog.component'
              ).then((e) => e.ImageEditorDialogComponent),
          },
        ],
        canActivate: [authGuardGuard],
      },
    ],
  },
];
