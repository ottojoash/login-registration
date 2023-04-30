import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '',loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'signup',loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
