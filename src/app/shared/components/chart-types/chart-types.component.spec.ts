import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTypesComponent } from './chart-types.component';

describe('ChartTypesComponent', () => {
  let component: ChartTypesComponent;
  let fixture: ComponentFixture<ChartTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
