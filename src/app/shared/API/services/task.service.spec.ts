import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskService } from './task.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.dev';
import { Task } from '../../models/task.model';
import { QueryOptions } from '../models/QueryOptions.interface';
import { TaskPriority, TaskStatus, TaskType } from '../../constants/variants.enum';
import { taskItemsMock } from '../../mockups/testTaskItems.mockup';

describe('TaskService', () => {
    let service: TaskService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TaskService, provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(TaskService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should load all tasks', fakeAsync(() => {
        const mockResponse = { success: true, data: taskItemsMock };

        let responseData: any;
        service.loadAllTasks().subscribe((res) => (responseData = res));

        tick();

        const req = httpMock.expectOne(`${environment.apiUrl}/task`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);

        expect(responseData).toEqual(mockResponse);
    }));

    it('should load a task by ID', fakeAsync(() => {
        const mockResponse = { success: true, data: taskItemsMock[0] };

        let result: any;
        service.loadTaskById({ _id: '1' }).subscribe((res) => (result = res));

        tick();

        const req = httpMock.expectOne(`${environment.apiUrl}/task/1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);

        expect(result).toEqual(mockResponse);
    }));

    it('should load tasks by user ID', fakeAsync(() => {
        const mockResponse = { success: true, data: taskItemsMock };

        let result: any;
        service.loadTaskByUserId({ creator: '1' }).subscribe((res) => (result = res));

        tick();

        const req = httpMock.expectOne(`${environment.apiUrl}/task/user/1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);

        expect(result).toEqual(mockResponse);
    }));

    it('should create a new task', fakeAsync(() => {
        const newTask = {
            title: 'New title',
            details: 'New details',
            creator: 'creator',
            assignee: 'assignee',
            startDate: new Date('2025-03-08'),
            endDate: new Date('2025-03-08'),
            type: TaskType.DOC,
            status: TaskStatus.BACKLOG,
            priority: TaskPriority.HIGH,
        };
        const mockResponse = { success: true, data: { ...newTask, _id: '3' } };

        let result: any;
        service.createTask(newTask).subscribe((res) => (result = res));

        tick();

        const req = httpMock.expectOne(`${environment.apiUrl}/task`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newTask);
        req.flush(mockResponse);

        expect(result).toEqual(mockResponse);
    }));

    it('should update a task by ID', fakeAsync(() => {
        const updatedTask: Task = { ...taskItemsMock[0], title: 'Updated Task', details: 'Updated', creator: '1' };
        const mockResponse = { success: true, data: updatedTask };

        let result: any;
        service.updateTaskById(updatedTask).subscribe((res) => (result = res));

        tick();

        const req = httpMock.expectOne(`${environment.apiUrl}/task/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updatedTask);
        req.flush(mockResponse);

        expect(result).toEqual(mockResponse);
    }));

    it('should delete a task by ID', fakeAsync(() => {
        const mockResponse = { success: true, data: { _id: '1' } as Task };

        let result: any;
        service.deleteTaskById({ _id: '1' }).subscribe((res) => (result = res));

        tick();

        const req = httpMock.expectOne(`${environment.apiUrl}/task/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(mockResponse);

        expect(result).toEqual(mockResponse);
    }));

    it('should query tasks', fakeAsync(() => {
        const query: QueryOptions<Task> = { filter: { title: 'Test' } } as QueryOptions<Task>;
        const mockResponse = { success: true, data: taskItemsMock };

        let result: any;
        service.queryTask(query).subscribe((res) => (result = res));

        tick();

        const req = httpMock.expectOne(`${environment.apiUrl}/task/query`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(query);
        req.flush(mockResponse);

        expect(result).toEqual(mockResponse);
    }));
});
