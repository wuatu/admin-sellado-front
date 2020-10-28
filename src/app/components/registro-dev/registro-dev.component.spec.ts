import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroDevComponent } from './registro-dev.component';

describe('RegistroDevComponent', () => {
  let component: RegistroDevComponent;
  let fixture: ComponentFixture<RegistroDevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroDevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
