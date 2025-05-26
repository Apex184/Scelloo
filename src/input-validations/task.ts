import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../models'


export const TaskSchema = z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED]),
    priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]),
    dueDate: z.string().optional().transform((val) => val ? new Date(val) : undefined).refine(date => date instanceof Date || date === undefined, {
        message: "Invalid date format",
    }),
});

export type TaskSchema = z.TypeOf<typeof TaskSchema>;


export const UpdateTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED]).optional(),
    priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]).optional(),
    dueDate: z.string().optional().transform((val) => val ? new Date(val) : undefined).refine(date => date instanceof Date || date === undefined, {
        message: "Invalid date format",
    }).optional(),
});

export type UpdateTaskSchema = z.TypeOf<typeof UpdateTaskSchema>;