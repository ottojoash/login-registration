import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GadgetService } from './gadget.service'; // Ensure this path is correct

@Component({
  selector: 'app-edit-gadget-modal',
  templateUrl: './edit-gadget-modal.component.html',
  styleUrls: ['./edit-gadget-modal.component.scss']
})
export class EditGadgetModalComponent {
  @Input() gadget: any; // Using 'any' type here if you are not using a specific model
  @Output() close = new EventEmitter<void>();

  updatedGadget: any = {}; // Using 'any' type here if you are not using a specific model

  constructor(private gadgetService: GadgetService) {}

  ngOnChanges(): void {
    if (this.gadget) {
      this.updatedGadget = { ...this.gadget };
    }
  }

  onSave(): void {
    if (this.updatedGadget._id) {
      this.gadgetService.updateGadget(this.updatedGadget._id, this.updatedGadget).subscribe(
        (response: any) => {
          console.log('Gadget updated successfully', response);
          this.close.emit(); // Close the modal after saving
        },
        (error: any) => {
          console.error('Error updating gadget:', error);
        }
      );
    }
  }

  onClose(): void {
    this.close.emit(); // Emit the close event to the parent component
  }
}
