import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightHomeComponent } from './insight-home.component';

describe('InsightHomeComponent', () => {
  let component: InsightHomeComponent;
  let fixture: ComponentFixture<InsightHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsightHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
