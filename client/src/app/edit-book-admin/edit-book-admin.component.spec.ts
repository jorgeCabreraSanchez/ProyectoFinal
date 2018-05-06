import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookAdminComponent } from './edit-book-admin.component';

describe('EditBookAdminComponent', () => {
  let component: EditBookAdminComponent;
  let fixture: ComponentFixture<EditBookAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBookAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBookAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
