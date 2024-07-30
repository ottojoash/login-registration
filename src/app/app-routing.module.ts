import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Ensure this import is correct
import { HomeComponent } from './home/home.component'; // Ensure this import is correct
import { CategorySelectionComponent } from './category-selection/category-selection.component'; // New import
import { RegisterGadgetComponent } from './register-gadget/register-gadget.component';
import { ReportGadgetComponent } from './report-gadget/report-gadget.component';
import { ViewGadgetsComponent } from './view-gadgets/view-gadgets.component';
import { TransferOwnershipComponent } from './transfer-ownership/transfer-ownership.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  { path: '', component: CategorySelectionComponent }, // Set the new component as the initial page
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'signup', loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule) },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, 
  { path: 'register-gadget', component: RegisterGadgetComponent }, 
  { path: 'report-gadget', component: ReportGadgetComponent }, 
  { path: 'view-gadgets', component: ViewGadgetsComponent }, 
  { path: 'transfer-ownership', component: TransferOwnershipComponent }, 
  { path: 'notifications', component: NotificationsComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
