import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import TaskService from '../services/Task.services';
import { Types } from 'mongoose';
import { Task } from '../entities/Task.entity';
import { successResponse } from '../utils/resSuccess.util';
import { QueryOptions } from '../types/QueryOptions.interface';
export default class TaskController {
    private static service = new TaskService();

    static getAllTask: RequestHandler = async (req, res, next) => {
        const tasks = await this.service.findAll();
        res.status(200).json(successResponse(tasks, 'Get all tasks successfully'));
    };

    static getTaskById: RequestHandler<{ taskId: Types.ObjectId }> = async (req, res, next) => {
        const { taskId } = req.params;
        const task = await this.service.findById(taskId);
        if (task) {
            res.status(200).json(successResponse(task, 'Found Task Success'));
            return;
        }
        next(createHttpError(404, 'Not Found Task'));
    };

    static getTaskByUser: RequestHandler<{ userId: Types.ObjectId }> = async (req, res, next) => {
        const { userId } = req.params;
        const tasks = await this.service.findByUserId(userId);
        if (tasks) {
            res.status(200).json(successResponse(tasks, 'Get All Tasks of users Success'));
            return;
        }
        next(createHttpError(404, 'Not Found User'));
    };

    static createTask: RequestHandler<{}, {}, Omit<Task, '_id'>> = async (req, res, next) => {
        const task = req.body;
        const createdTask = await this.service.create(task);
        res.status(200).json(successResponse(createdTask, 'Create Task Success'));
        return;
    };

    static updateTaskById: RequestHandler<{ taskId: Types.ObjectId }> = async (req, res, next) => {
        const { taskId } = req.params;
        const task: Partial<Task> = req.body;

        const updatedTask = await this.service.update({ ...task, _id: taskId });
        if (updatedTask) {
            res.status(200).json(successResponse(updatedTask, 'Update Tasks Success'));
            return;
        }
        next(createHttpError(404, 'Not Found Task'));
    };

    static deleteTask: RequestHandler<{ taskId: Types.ObjectId }> = async (req, res, next) => {
        const { taskId } = req.params;
        const deletedTask = await this.service.delete(taskId);
        if (deletedTask) {
            res.status(200).json(successResponse(deletedTask, 'Delete Task Success'));
            return;
        }
        next(createHttpError(404, 'Not Found Task'));
    };

    static queryTask: RequestHandler<{}, {}, QueryOptions<Task>> = async (req, res, next) => {
        const queryOptions = req.body;
        const queriedTask = await this.service.query(queryOptions);
        if (queriedTask) {
            res.status(200).json(successResponse(queriedTask, 'Query Task Success'));
        }
    };
}
