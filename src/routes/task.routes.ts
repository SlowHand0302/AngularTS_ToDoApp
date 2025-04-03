import express from 'express';
import TaskController from '../controllers/task.controller';

const routers = express.Router();

routers.get('/', TaskController.getAllTask);
routers.post('/', TaskController.createTask);
routers.delete('/:taskId', TaskController.deleteTask);
routers.get('/:taskId', TaskController.getTaskById);
routers.put('/:taskId', TaskController.updateTaskById);
routers.get('/user/:userId', TaskController.getTaskByUser);
routers.get('/filter', TaskController.filterTask);
routers.get('/search', TaskController.searchTaskByTitle);

export default routers;
