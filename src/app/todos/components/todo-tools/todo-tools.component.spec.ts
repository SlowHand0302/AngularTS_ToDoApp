import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoToolsComponent } from './todo-tools.component';

describe('TodoToolsComponent', () => {
  let component: TodoToolsComponent;
  let fixture: ComponentFixture<TodoToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoToolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
