import { Types } from 'mongoose';

export type Task = {
    _id: Types.ObjectId;
    creator: Types.ObjectId;
    assignee: Types.ObjectId;
    title: string;
    details: string;
    startDate: Date;
    endDate: Date;
    status: TaskStatus;
    priority: TaskPriority;
    type: TaskType;
};

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    BACKLOG = 'BACKLOG',
    CANCELED = 'CANCELED',
}

export enum TaskType {
    DOC = 'DOC',
    FIX = 'FIX',
    FEATURE = 'FEATURE',
    TEST = 'TEST',
    REFACTOR = 'REFACTOR',
}

export enum TaskPriority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
}
