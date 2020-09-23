import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionColaboradorComponent } from './produccion-colaborador.component';

describe('ProduccionColaboradorComponent', () => {
  let component: ProduccionColaboradorComponent;
  let fixture: ComponentFixture<ProduccionColaboradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProduccionColaboradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccionColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
