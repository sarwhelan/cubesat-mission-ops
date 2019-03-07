import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemLimitsComponent } from './telem-limits.component';

describe('TelemLimitsComponent', () => {
  let component: TelemLimitsComponent;
  let fixture: ComponentFixture<TelemLimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemLimitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
