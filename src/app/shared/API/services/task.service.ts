import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.dev';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { SuccessResponse } from '../models/SuccessResponse.interface';
import { QueryOptions } from '../models/QueryOptions.interface';
@Injectable({
    providedIn: 'root',
})
export class TaskService {
    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/task`;

    public loadAllTasks(): Observable<SuccessResponse<Task[]>> {
        return this.httpClient.get<SuccessResponse<Task[]>>(`${this.baseUrl}`);
    }

    public loadTaskById(taskID: Pick<Task, '_id'>): Observable<SuccessResponse<Task>> {
        return this.httpClient.get<SuccessResponse<Task>>(`${this.baseUrl}/${taskID._id}`);
    }

    public loadTaskByUserId(userID: Pick<Task, 'creator'>): Observable<SuccessResponse<Task[]>> {
        return this.httpClient.get<SuccessResponse<Task[]>>(`${this.baseUrl}/user/${userID}`);
    }

    public createTask(task: Omit<Task, '_id'>): Observable<SuccessResponse<Task>> {
        return this.httpClient.post<SuccessResponse<Task>>(`${this.baseUrl}`, task);
    }

    public updateTaskById(task: Task): Observable<SuccessResponse<Task>> {
        return this.httpClient.put<SuccessResponse<Task>>(`${this.baseUrl}/${task._id}`, task);
    }

    public deleteTaskById(id: Pick<Task, '_id'>) {
        return this.httpClient.delete<SuccessResponse<Task>>(`${this.baseUrl}/${id._id}`);
    }

    public queryTask(query: QueryOptions<Task>) {
        console.log(query);
        return this.httpClient.post<SuccessResponse<Task[]>>(`${this.baseUrl}/query`, query);
    }
}
