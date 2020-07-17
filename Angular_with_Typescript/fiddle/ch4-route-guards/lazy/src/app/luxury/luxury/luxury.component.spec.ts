import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxuryComponent } from './luxury.component';

describe('LuxuryComponent', () => {
  let component: LuxuryComponent;
  let fixture: ComponentFixture<LuxuryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuxuryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuxuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
