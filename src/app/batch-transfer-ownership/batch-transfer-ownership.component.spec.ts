import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTransferOwnershipComponent } from './batch-transfer-ownership.component';

describe('BatchTransferOwnershipComponent', () => {
  let component: BatchTransferOwnershipComponent;
  let fixture: ComponentFixture<BatchTransferOwnershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchTransferOwnershipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchTransferOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
