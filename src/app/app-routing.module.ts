import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { RegisterGadgetComponent } from './register-gadget/register-gadget.component';
import { ReportGadgetComponent } from './report-gadget/report-gadget.component';
import { ViewGadgetsComponent } from './view-gadgets/view-gadgets.component';
import { TransferOwnershipComponent } from './transfer-ownership/transfer-ownership.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CategorySelectionComponent } from './category-selection/category-selection.component';
import { BatchUploadComponent } from './batch-upload/batch-upload.component';
import { BatchTransferOwnershipComponent } from './batch-transfer-ownership/batch-transfer-ownership.component';

const routes: Routes = [
  { path: '', component: CategorySelectionComponent },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'signup', loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule) },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'register-gadget', component: RegisterGadgetComponent },
      { path: 'report-gadget', component: ReportGadgetComponent },
      { path: 'view-gadgets', component: ViewGadgetsComponent },
      { path: 'transfer-ownership', component: TransferOwnershipComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'batch-upload', component: BatchUploadComponent }, // Add route for batch upload
      { path: 'batch-transfer-ownership', component: BatchTransferOwnershipComponent }, // New route
      


    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
