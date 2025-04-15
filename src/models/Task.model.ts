import mongoose, { Types } from 'mongoose';
import { TaskPriority, TaskStatus, TaskType } from '../entities/Task.entity';
const Schema = mongoose.Schema;

interface ITask extends Document {
    creator: Types.ObjectId;
    assignee: Types.ObjectId;
    title: string;
    details: string;
    startDate: Date;
    endDate: Date;
    status: TaskStatus;
    priority: TaskPriority;
    type: TaskType;
}

const Tasks = new Schema<ITask>(
    {
        creator: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        assignee: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        title: { type: String, required: true },
        details: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String, enum: Object.values(TaskStatus), required: true, default: TaskStatus.TODO },
        priority: { type: String, enum: Object.values(TaskPriority), required: true, default: TaskPriority.LOW },
        type: { type: String, enum: Object.values(TaskType), required: true, default: TaskType.FEATURE },
    },
    {
        timestamps: true,
    },
);

const TaskModel = mongoose.model<ITask>('Tasks', Tasks);

export { TaskModel, ITask };
