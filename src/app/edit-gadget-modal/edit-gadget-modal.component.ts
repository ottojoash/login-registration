// edit-gadget-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-gadget-modal',
  templateUrl: './edit-gadget-modal.component.html',
  styleUrls: ['./edit-gadget-modal.component.css']
})
export class EditGadgetModalComponent {
  @Input() gadget: any; // The gadget data passed to the modal
  @Input() showModal: boolean = false; // Default to false (modal hidden)
  @Output() close = new EventEmitter<void>(); // Event emitter for closing the modal
  @Output() save = new EventEmitter<any>(); // Event emitter for saving changes

  closeModal() {
    this.close.emit();
  }

  saveChanges() {
    this.save.emit(this.gadget);
  }
}
