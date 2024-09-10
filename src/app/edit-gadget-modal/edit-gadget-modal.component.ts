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

  onSave(updatedGadget: any) {
    if (!updatedGadget) {
      console.error('No gadget data provided');
      return;
    }
  
    const gadgetId = updatedGadget._id;
  
    if (!gadgetId) {
      console.error('Gadget ID is missing');
      return;
    }
  
    this.gadgetService.updateGadget(gadgetId, updatedGadget).subscribe(
      (response) => {
        console.log('Gadget updated successfully:', response);
        // this.updateGadgetInList(updatedGadget); // Update the gadget in the local list
        this.onClose(); // Close the modal after saving
      },
      (error) => {
        console.error('Error updating gadget:', error);
      }
    );
  }
  
  

  onClose(): void {
    this.close.emit(); // Emit the close event to the parent component
  }
}
