import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterGadgetComponent } from './register-gadget.component';

describe('RegisterGadgetComponent', () => {
  let component: RegisterGadgetComponent;
  let fixture: ComponentFixture<RegisterGadgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterGadgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterGadgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
