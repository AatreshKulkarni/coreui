import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbdownloadComponent } from './dbdownload.component';

describe('DbdownloadComponent', () => {
  let component: DbdownloadComponent;
  let fixture: ComponentFixture<DbdownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbdownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbdownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
