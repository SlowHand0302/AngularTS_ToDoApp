import { TaskType, TaskStatus, TaskPriority } from '../constants/variants.enum';

export const taskItemsMock = [
    {
        _id: '1',
        title: 'Sample 1 title',
        details: 'Sample 1 details',
        creator: '1',
        assignee: '1',
        startDate: new Date('2025-03-08'),
        endDate: new Date('2025-03-08'),
        type: TaskType.DOC,
        status: TaskStatus.BACKLOG,
        priority: TaskPriority.HIGH,
    },
    {
        _id: '2',
        title: 'Sample 2 title',
        details: 'Sample 2 details',
        creator: '1',
        assignee: '1',
        startDate: new Date('2025-03-08'),
        endDate: new Date('2025-03-08'),
        type: TaskType.DOC,
        status: TaskStatus.BACKLOG,
        priority: TaskPriority.HIGH,
    },
];
