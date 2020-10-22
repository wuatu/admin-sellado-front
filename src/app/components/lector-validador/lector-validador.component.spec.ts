import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorValidadorComponent } from './lector-validador.component';

describe('LectorValidadorComponent', () => {
  let component: LectorValidadorComponent;
  let fixture: ComponentFixture<LectorValidadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectorValidadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectorValidadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
