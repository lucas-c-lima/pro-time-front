import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightInfosComponent } from './insight-infos.component';

describe('InsightInfosComponent', () => {
  let component: InsightInfosComponent;
  let fixture: ComponentFixture<InsightInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsightInfosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
