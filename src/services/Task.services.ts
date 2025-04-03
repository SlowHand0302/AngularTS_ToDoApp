import { Types } from 'mongoose';
import { Task } from '../entities/Task.entity';
import TaskRepo from '../repositories/Task.repository';
import { FilterOption } from '../types/FilterOption.type';
import { SortOption } from '../types/SortOption.type';
import { TaskModel } from '../models/Task.model';
import { title } from 'process';

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
    async filter(filterOptions: FilterOption<Task>[]): Promise<Task[]> {
        const filter = Object.assign({}, ...filterOptions);
        return await TaskModel.find({ ...filter }).lean();
    }
    async sort(sortOptions: SortOption<Task>): Promise<Task[]> {
        throw new Error('Method not implemented.');
    }
}
