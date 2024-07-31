import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGadgetsComponent } from './view-gadgets.component';

describe('ViewGadgetsComponent', () => {
  let component: ViewGadgetsComponent;
  let fixture: ComponentFixture<ViewGadgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGadgetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewGadgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
