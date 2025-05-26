// import { Response } from 'express';
// import { Task } from '../models/task';
// import { AuthRequest } from '../middleware/auth';
// import { HttpError } from '../errors/http-error';
// import { ErrorMessage } from '../utils';

// export class TaskController {
//     static async create(req: AuthRequest, res: Response) {
//         const { title, description, status, priority, dueDate } = req.body;
//         const userId = req.user!.id;

//         const task = await Task.create({
//             title,
//             description,
//             status: status || 'TODO',
//             priority: priority || 'MEDIUM',
//             dueDate: dueDate ? new Date(dueDate) : undefined,
//             userId,
//             timeSpent: 0,
//         });

//         return res.status(201).json({
//             success: true,
//             message: 'Task created successfully',
//             data: task,
//         });
//     }

//     static async getAll(req: AuthRequest, res: Response) {
//         const userId = req.user!.id;
//         const { page = 1, limit = 10, status, priority } = req.query;

//         const where: any = { userId };
//         if (status) where.status = status;
//         if (priority) where.priority = priority;

//         const tasks = await Task.findAndCountAll({
//             where,
//             limit: Number(limit),
//             offset: (Number(page) - 1) * Number(limit),
//             order: [['createdAt', 'DESC']],
//         });

//         return res.json({
//             success: true,
//             message: 'Tasks retrieved successfully',
//             data: {
//                 tasks: tasks.rows,
//                 total: tasks.count,
//                 page: Number(page),
//                 totalPages: Math.ceil(tasks.count / Number(limit)),
//             },
//         });
//     }

//     // static async update(req: AuthRequest, res: Response) {
//     //     const { id } = req.params;
//     //     const userId = req.user!.id;
//     //     const updateData = req.body;

//     //     const task = await Task.findOne({ where: { id, userId } });
//     //     if (!task) {
//     //         throw new HttpError(ErrorMessage.TaskNotFound);
//     //     }

//     //     if (updateData.status === 'COMPLETED' && !task.completedAt) {
//     //         updateData.completedAt = new Date();
//     //     }

//     //     await task.update(updateData);

//     //     return res.json({
//     //         success: true,
//     //         message: 'Task updated successfully',
//     //         data: task,
//     //     });
//     // }

//     // static async delete(req: AuthRequest, res: Response) {
//     //     const { id } = req.params;
//     //     const userId = req.user!.id;

//     //     const task = await Task.findOne({ where: { id, userId } });
//     //     if (!task) {
//     //         throw new HttpError(ErrorMessage.TaskNotFound);
//     //     }

//     //     await task.destroy();

//     //     return res.json({
//     //         success: true,
//     //         message: 'Task deleted successfully',
//     //         data: null,
//     //     });
//     // }

//     static async getReport(req: AuthRequest, res: Response) {
//         const userId = req.user!.id;

//         const tasks = await Task.findAll({
//             where: { userId },
//             attributes: ['status', 'timeSpent'],
//         });

//         const totalTasks = tasks.length;
//         const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
//         const totalTimeSpent = tasks.reduce((sum, task) => sum + task.timeSpent, 0);

//         return res.json({
//             success: true,
//             message: 'Report generated successfully',
//             data: {
//                 totalTasks,
//                 completedTasks,
//                 completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
//                 totalTimeSpent,
//                 averageTimePerTask: totalTasks ? totalTimeSpent / totalTasks : 0,
//             },
//         });
//     }
// } 