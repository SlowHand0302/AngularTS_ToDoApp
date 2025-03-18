import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSkeletonsComponent } from './todo-skeletons.component';

describe('TodoSkeletonsComponent', () => {
  let component: TodoSkeletonsComponent;
  let fixture: ComponentFixture<TodoSkeletonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoSkeletonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoSkeletonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
