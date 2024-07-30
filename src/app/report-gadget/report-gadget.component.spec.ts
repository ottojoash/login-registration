import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGadgetComponent } from './report-gadget.component';

describe('ReportGadgetComponent', () => {
  let component: ReportGadgetComponent;
  let fixture: ComponentFixture<ReportGadgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportGadgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportGadgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
