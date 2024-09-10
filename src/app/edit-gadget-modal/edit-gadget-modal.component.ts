import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-gadget-modal',
  templateUrl: './edit-gadget-modal.component.html',
  styleUrls: ['./edit-gadget-modal.component.scss']
})
export class EditGadgetModalComponent {
  @Input() gadget: any;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  updatedGadget: any = {};

  ngOnChanges(): void {
    // Initialize the updatedGadget with the current gadget's data
    if (this.gadget) {
      this.updatedGadget = { ...this.gadget };
    }
  }

  onSave(): void {
    this.save.emit(this.updatedGadget); // Emit the updated gadget to the parent component
  }

  onClose(): void {
    this.close.emit(); // Emit the close event to the parent component
  }
}
