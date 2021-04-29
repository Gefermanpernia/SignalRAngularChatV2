import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatlayoutComponent } from './chatlayout.component';

describe('ChatlayoutComponent', () => {
  let component: ChatlayoutComponent;
  let fixture: ComponentFixture<ChatlayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatlayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
