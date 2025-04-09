import { TaskStatus, TaskPriority, TaskType } from '../constants/variants.enum';

export interface Task {
    _id: string;
    creator: string;
    assignee: string;
    title: string;
    details: string;
    startDate: Date;
    endDate: Date;
    status: TaskStatus;
    priority: TaskPriority;
    type: TaskType;
}
