import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { CategorySelectionComponent } from './category-selection/category-selection.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';  // Ensure this import is correct
import { FormsModule } from '@angular/forms';
import { RegisterGadgetComponent } from './register-gadget/register-gadget.component';
import { ReportGadgetComponent } from './report-gadget/report-gadget.component';
import { ViewGadgetsComponent } from './view-gadgets/view-gadgets.component';
import { TransferOwnershipComponent } from './transfer-ownership/transfer-ownership.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { HttpClientModule } from '@angular/common/http';
import { BatchUploadComponent } from './batch-upload/batch-upload.component';
import { BatchTransferOwnershipComponent } from './batch-transfer-ownership/batch-transfer-ownership.component';
import { EditGadgetModalComponent } from './edit-gadget-modal/edit-gadget-modal.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CategorySelectionComponent,
    RegisterGadgetComponent,
    ReportGadgetComponent,
    ViewGadgetsComponent,
    TransferOwnershipComponent,
    NotificationsComponent,
    BatchUploadComponent,
    BatchTransferOwnershipComponent,
    EditGadgetModalComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,  // Ensure this is added to imports
    FormsModule,
    HttpClientModule,
    NgxPaginationModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
