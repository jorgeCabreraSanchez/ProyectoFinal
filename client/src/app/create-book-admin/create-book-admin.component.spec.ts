import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookAdminComponent } from './create-book-admin.component';

describe('CreateBookAdminComponent', () => {
  let component: CreateBookAdminComponent;
  let fixture: ComponentFixture<CreateBookAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBookAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBookAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
