import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGadgetModalComponent } from './edit-gadget-modal.component';

describe('EditGadgetModalComponent', () => {
  let component: EditGadgetModalComponent;
  let fixture: ComponentFixture<EditGadgetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGadgetModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGadgetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
