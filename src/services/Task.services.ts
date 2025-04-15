import { SortOrder, Types } from 'mongoose';
import { Task } from '../entities/Task.entity';
import TaskRepo from '../repositories/Task.repository';
import { ITask, TaskModel } from '../models/Task.model';
import { QueryOptions } from '../types/QueryOptions.interface';
import { filterAdapter, searchAdapter, sortAdapter } from '../utils/mongooseFilterAdapter.utils';

export default class TaskService implements TaskRepo {
    async findAll(): Promise<Task[]> {
        return await TaskModel.find().lean();
    }
    async findById(_id: Types.ObjectId): Promise<Task | null> {
        return await TaskModel.findById(_id).lean();
    }
    async findByUserId(userId: Types.ObjectId): Promise<Task[]> {
        return await TaskModel.find({ creator: userId }).lean();
    }
    async searchByTitle(title: string, userId: Types.ObjectId): Promise<Task[]> {
        return await TaskModel.find({ title: { $regex: title, $option: 'i' }, creator: { $eq: userId } })
            .limit(10)
            .lean();
    }
    async create(task: Omit<Task, '_id'>): Promise<Task> {
        const newTask = new TaskModel(task);
        await newTask.save();
        return newTask.toObject();
    }
    async update(task: Partial<Task>): Promise<Task | null> {
        const updatedTask = await TaskModel.findByIdAndUpdate(task._id, { ...task }, { returnOriginal: false });
        return updatedTask?.toObject() as Task;
    }
    async delete(_id: Types.ObjectId): Promise<Task | null> {
        return await TaskModel.findByIdAndDelete(_id).lean();
    }
    async query(filterOptions: QueryOptions<Task>): Promise<Task[]> {
        const { filter, sort, search, pagination } = filterOptions;
        let query = TaskModel.find();
        if (filter) {
            query = query.find(filterAdapter(filter));
        }
        if (search) {
            console.log(searchAdapter(search))
            query = query.find(searchAdapter(search));
        }
        if (sort) {
            query = query.sort(sortAdapter(sort as string[]));
        }
        if (pagination) {
            query = query.skip(pagination.page * pagination.pageSize).limit(pagination.pageSize);
        }
        return await query.lean();
    }
}
