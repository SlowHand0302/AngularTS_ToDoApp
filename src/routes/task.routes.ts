import express from 'express';
import TaskController from '../controllers/task.controller';
import { catchAsync } from '../utils/catchAsync.util';
import { filterMiddleware } from '../middlewares/filter.middleware';
import { Task } from '../entities/Task.entity';

const routers = express.Router();
routers.get('/', catchAsync(TaskController.getAllTask));
routers.post('/', catchAsync(TaskController.createTask));
routers.post('/query', catchAsync(TaskController.queryTask));
routers.delete('/:taskId', catchAsync(TaskController.deleteTask));
routers.get('/:taskId', catchAsync(TaskController.getTaskById));
routers.put('/:taskId', catchAsync(TaskController.updateTaskById));
routers.get('/user/:userId', catchAsync(TaskController.getTaskByUser));

export default routers;
