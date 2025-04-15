import { Task } from '../entities/Task.entity';
import { Types } from 'mongoose';
import { QueryOptions } from '../types/QueryOptions.interface';

export default interface TaskRepo {
    findAll(): Promise<Task[]>;
    findById(_id: Types.ObjectId): Promise<Task | null>;
    findByUserId(userId: Types.ObjectId): Promise<Task[]>;
    searchByTitle(taskTitle: string, userId: Types.ObjectId): Promise<Task[]>;
    create(task: Omit<Task, '_id'>): Promise<Task>;
    update(task: Partial<Task>): Promise<Task | null>;
    delete(_id: Types.ObjectId): Promise<Task | null>;
    query(filterOptions: QueryOptions<Task>): Promise<Task[]>;
}
