// Angular Imports
import { NgModule } from '@angular/core';
import { RegistrationRoutingModule } from './registration-routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// This Module's Components
import { RegistrationComponent } from './registration.component';
import { ReactiveFormsModule } from '@angular/forms';  // <-- Import this


@NgModule({
    imports: [
        RegistrationRoutingModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [
        RegistrationComponent,
    ]
})
export class RegistrationModule {

}
