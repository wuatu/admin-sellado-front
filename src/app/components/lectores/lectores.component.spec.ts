import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectoresComponent } from './lectores.component';

describe('LectoresComponent', () => {
  let component: LectoresComponent;
  let fixture: ComponentFixture<LectoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
