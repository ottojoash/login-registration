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
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';



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

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,  // Ensure this is added to imports
    FormsModule,
    HttpClientModule,
    MdbFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
