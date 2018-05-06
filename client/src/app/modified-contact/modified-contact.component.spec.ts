import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifiedContactComponent } from './modified-contact.component';

describe('ModifiedContactComponent', () => {
  let component: ModifiedContactComponent;
  let fixture: ComponentFixture<ModifiedContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifiedContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifiedContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
