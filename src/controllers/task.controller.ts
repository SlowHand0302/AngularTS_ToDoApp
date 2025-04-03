import { RequestHandler } from 'express';
import TaskService from '../services/Task.services';
import createHttpError from 'http-errors';
import { Types } from 'mongoose';
import { Task } from '../entities/Task.entity';
import { FilterOption } from '../types/FilterOption.type';

export default class TaskController {
    static getAllTask: RequestHandler = async (req, res, next) => {
        const service = new TaskService();
        try {
            const tasks = await service.findAll();
            res.status(200).json({
                statusCode: 200,
                message: 'Get All Tasks Success',
                metadata: [...tasks],
            });
            return;
        } catch (error) {
            next(error);
        }
    };

    static getTaskById: RequestHandler<{ taskId: Types.ObjectId }> = async (req, res, next) => {
        const { taskId } = req.params;
        const service = new TaskService();
        try {
            const task = await service.findById(taskId);
            if (task) {
                res.status(200).json({
                    statusCode: 200,
                    message: 'Found Task Success',
                    metadata: { ...task },
                });
                return;
            }
            next(createHttpError(404, 'Not Found Task'));
        } catch (error) {
            next(error);
        }
    };

    static getTaskByUser: RequestHandler<{ userId: Types.ObjectId }> = async (req, res, next) => {
        const { userId } = req.params;
        const service = new TaskService();
        try {
            const tasks = await service.findByUserId(userId);
            if (tasks) {
                res.status(200).json({
                    statusCode: 200,
                    message: 'Get All Tasks of users Success',
                    metadata: [...tasks],
                });
                return;
            }
            next(createHttpError(404, 'Not Found User'));
        } catch (error) {
            next(error);
        }
    };

    static createTask: RequestHandler = async (req, res, next) => {
        const task: Omit<Task, '_id'> = req.body;
        const service = new TaskService();
        try {
            const createdTask = await service.create(task);
            res.status(200).json({
                statusCode: 200,
                message: 'Create Task Success',
                metadata: { ...createdTask },
            });
            return;
        } catch (error) {
            next(error);
        }
    };

    static updateTaskById: RequestHandler<{ taskId: Types.ObjectId }> = async (req, res, next) => {
        const { taskId } = req.params;
        const task: Partial<Task> = req.body;

        const service = new TaskService();
        try {
            const updatedTask = await service.update({ ...task, _id: taskId });
            if (updatedTask) {
                res.status(200).json({
                    statusCode: 200,
                    message: 'Update Tasks Success',
                    metadata: { ...updatedTask },
                });
                return;
            }
            next(createHttpError(404, 'Not Found Task'));
        } catch (error) {
            next(error);
        }
    };

    static deleteTask: RequestHandler<{ taskId: Types.ObjectId }> = async (req, res, next) => {
        const { taskId } = req.params;
        const service = new TaskService();
        try {
            const deletedTask = await service.delete(taskId);
            if (deletedTask) {
                res.status(200).json({
                    statusCode: 200,
                    message: 'Delete Task Success',
                });
                return;
            }
            next(createHttpError(404, 'Not Found Task'));
        } catch (error) {
            next(error);
        }
    };

    static filterTask: RequestHandler = async (req, res, next) => {
        // const filterOptions: FilterOption<Task>[] = req.query;
    };

    static searchTaskByTitle: RequestHandler = async (req, res, next) => {};
}
