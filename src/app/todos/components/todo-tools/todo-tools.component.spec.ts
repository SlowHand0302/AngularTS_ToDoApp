import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoToolsComponent } from './todo-tools.component';
import { TodoService } from '../../services/todo.service';
import { BehaviorSubject } from 'rxjs';
import { FilterOption, todoFilterList } from '../../../shared/models/filter.model';
import { Todo } from '../../../shared/models/todo.model';
import { SortOption, todoSortList } from '../../../shared/models/sort.model';

describe('TodoToolsComponent', () => {
    let component: TodoToolsComponent;
    let fixture: ComponentFixture<TodoToolsComponent>;
    let todoServiceMock: Partial<TodoService>;
    let filterOptionMock: BehaviorSubject<FilterOption<Todo>[]>;
    let sortOptionMock: BehaviorSubject<SortOption<Todo>>;

    const createService = () => {
        filterOptionMock = new BehaviorSubject<FilterOption<Todo>[]>([]);
        sortOptionMock = new BehaviorSubject<SortOption<Todo>>({ key: 'title', order: 'asc' });
        todoServiceMock = {
            setFilterOption: jest.fn().mockImplementation((option) => {
                filterOptionMock.next([...filterOptionMock.value, option]);
            }),
            setSortOption: jest.fn().mockImplementation((option) => {
                sortOptionMock.next(option);
            }),
        };
    };

    beforeEach(async () => {
        createService();

        await TestBed.configureTestingModule({
            imports: [TodoToolsComponent],
            providers: [{ provide: TodoService, useValue: todoServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(TodoToolsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add sort option to service when sort option is selected', () => {
        component.handleSelectSort({ item: { ...todoSortList[0] } });
        expect(todoServiceMock.setSortOption).toHaveBeenCalledWith({
            key: todoSortList[0].key,
            order: todoSortList[0].order,
        });
        expect(sortOptionMock.value).toEqual({
            key: todoSortList[0].key,
            order: todoSortList[0].order,
        });
    });

    it('should add filter option to service when filter option is selected', () => {
        component.handleSelectFilter({ item: { ...todoFilterList[0] } });
        expect(todoServiceMock.setFilterOption).toHaveBeenCalledWith({
            key: todoFilterList[0].key,
            value: todoFilterList[0].value,
        });

        expect(
            filterOptionMock.value.find(
                (item) => item.key === todoFilterList[0].key && item.value === todoFilterList[0].value,
            ),
        ).toBeTruthy();
    });
});
