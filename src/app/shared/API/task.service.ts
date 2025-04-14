import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { APIResponse } from '../models/APIResponse.model';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store', // Matches cache: 'no-store'
  });
  private readonly baseUrl = `${environment.apiUrl}/task`;

  public loadAllTasks(): Observable<APIResponse<Task[]>> {
    
    return this.httpClient.get<APIResponse<Task[]>>(`${this.baseUrl}`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  public loadTaskById(
    taskID: Pick<Task, '_id'>
  ): Observable<APIResponse<Task>> {
    return this.httpClient.get<APIResponse<Task>>(
      `${this.baseUrl}/${taskID._id}`,
      {
        headers: this.headers,
        withCredentials: true,
      }
    );
  }

  public loadTaskByUserId(
    userID: Pick<Task, 'creator'>
  ): Observable<APIResponse<Task[]>> {
    return this.httpClient.get<APIResponse<Task[]>>(
      `${this.baseUrl}/user/${userID}`,
      {
        headers: this.headers,
        withCredentials: true,
      }
    );
  }

  public createTask(task: Omit<Task, '_id'>): Observable<APIResponse<Task>> {
    return this.httpClient.post<APIResponse<Task>>(`${this.baseUrl}`, task, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  public updateTaskById(task: Task): Observable<APIResponse<Task>> {
    return this.httpClient.put<APIResponse<Task>>(
      `${this.baseUrl}/${task._id}`,
      task,
      {
        headers: this.headers,
        withCredentials: true,
      }
    );
  }

  public deleteTaskById(id: Pick<Task, '_id'>) {
    return this.httpClient.delete<APIResponse<Task>>(`${this.baseUrl}/${id._id}`, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
