import { RequestHandler } from 'express';
import { Op, QueryTypes, Sequelize } from 'sequelize';

import { TaskRepository } from '../repositories';
import { AuthenticationError, NotFoundError } from '../errors';
import { TaskSchema, UpdateTaskSchema } from '../input-validations';
import { logger, calculateCompletionRate, formatDuration } from '../utils';
import { db } from '../database';

export const createTask: RequestHandler<any, any, TaskSchema> = async (req, res) => {
    try {
        const taskRepo = new TaskRepository();

        const user = res.locals.user;
        if (!user) throw new AuthenticationError();

        const { title, description, status, priority, dueDate } = req.body;



        const newTask = await taskRepo.transaction(async (trx) => {
            return await taskRepo.create(
                {
                    title,
                    description,
                    status,
                    priority,
                    dueDate,
                    userId: user.id,
                    timeSpent: new Date().getTime()
                },
                { transaction: trx },
            );
        });

        return res.status(201).json({
            message: 'Task created successfully',
            task: {
                id: newTask.userId,
                title: newTask.title,
                description: newTask.description,
                status: newTask.status,
                priority: newTask.priority,
                dueDate: newTask.dueDate
            },
        });
    } catch (error) {
        console.error('Task created error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const getTasks: RequestHandler<any, any, any> = async (req, res) => {
    try {
        const user = res.locals.user;
        if (!user) throw new AuthenticationError();

        const { page = 1, limit = 10, status, priority } = req.query;
        const taskRepo = new TaskRepository();

        const where: any = { userId: user.id };
        if (status) where.status = status;
        if (priority) where.priority = priority;

        const { count, rows: tasks } = await taskRepo.findManyAndCount(
            where,
            {
                limit: Number(limit),
                page: Number(page),
                sort: '-createdAt'
            },
        );

        return res.status(200).json({
            message: 'Tasks fetched successfully',
            tasks: tasks.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                createdAt: task.createdAt,
                dueDate: task.dueDate
            })),
            pagination: {
                total: count,
                totalPages: Math.ceil(count / Number(limit)),
                currentPage: Number(page),
                pageSize: Number(limit)
            }
        });
    } catch (error) {
        logger.error('Task fetch error:', error);
        return res.status(500).json({
            message: error instanceof AuthenticationError
                ? 'Authentication required'
                : 'Internal server error'
        });
    }
};


export const getTask: RequestHandler<{ taskId: string }> = async (req, res) => {
    try {
        const user = res.locals.user;
        if (!user) throw new AuthenticationError();

        const taskRepo = new TaskRepository();
        const taskId = req.params.taskId;

        const task = await taskRepo.findByPk(taskId, {
            where: { userId: user.id }
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.status(200).json({
            message: 'Task fetched successfully',
            task: {
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate
            }
        });
    } catch (error) {
        logger.error('Task fetch error:', error);
        return res.status(500).json({
            message: error instanceof AuthenticationError
                ? 'Authentication required'
                : 'Internal server error'
        });
    }
};

export const updateTask: RequestHandler<{ taskId: string }, any, UpdateTaskSchema> = async (req, res) => {
    try {
        const taskRepo = new TaskRepository();
        const user = res.locals.user;
        if (!user) throw new AuthenticationError();

        const { taskId } = req.params;
        const updates = req.body;

        const updatedTask = await taskRepo.transaction(async (trx) => {
            const updatePayload = {
                ...updates,
                updatedAt: new Date()
            };

            const [affectedCount, tasks] = await taskRepo.update(
                { id: taskId, userId: user.id },
                updatePayload,
                {
                    transaction: trx
                }
            );

            if (affectedCount === 0 || !tasks?.[0]) {
                throw new NotFoundError('Task not found or unauthorized');
            }

            return tasks[0];
        });

        return res.status(200).json({
            message: 'Task updated successfully',
            task: {
                id: updatedTask.id,
                title: updatedTask.title,
                description: updatedTask.description,
                status: updatedTask.status,
                priority: updatedTask.priority,
                dueDate: updatedTask.dueDate,
                updatedAt: updatedTask.updatedAt
            },
        });
    } catch (error) {
        logger.error('Task update error:', error);
        return res.status(error instanceof NotFoundError ? 404 : 500).json({
            message: error instanceof NotFoundError
                ? error.message
                : 'Internal server error'
        });
    }
};


export const deleteTask: RequestHandler<{ taskId: string }> = async (req, res) => {
    try {
        const taskRepo = new TaskRepository();
        const user = res.locals.user;
        if (!user) throw new AuthenticationError();

        const { taskId } = req.params;

        const task = await taskRepo.findOne(
            { id: taskId, userId: user.id },
            { attributes: ['id'] }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        await taskRepo.destroy(
            { id: taskId, userId: user.id }
        );

        return res.status(204).send();
    } catch (error) {
        logger.error('Task deletion error:', error);

        return res.status(error instanceof AuthenticationError ? 401 : 500).json({
            message: error instanceof AuthenticationError
                ? 'Authentication required'
                : 'Internal server error'
        });
    }
};


export const getTimeReport: RequestHandler = async (req, res) => {
    try {
        const taskRepo = new TaskRepository();
        const user = res.locals.user;
        if (!user) throw new AuthenticationError();

        const { period = 'week' } = req.query;
        const endDate = new Date();
        const startDate = new Date();

        switch (period) {
            case 'day':
                startDate.setDate(endDate.getDate() - 1);
                break;
            case 'week':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            default:
                return res.status(400).json({ message: 'Invalid period' });
        }

        const tasks = await taskRepo.findMany({
            userId: user.id,
            createdAt: {
                [Op.between]: [startDate, endDate]
            }
        });

        const timeSpent = tasks.reduce((acc, task) =>
            acc + (task.timeSpent || 0), 0);

        return res.status(200).json({
            message: 'Time report generated',
            report: {
                period,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                totalTasks: tasks.length,
                totalTimeSpent: formatDuration(timeSpent),
                tasks: tasks.map(task => ({
                    id: task.id,
                    title: task.title,
                    timeSpent: formatDuration(task.timeSpent || 0)
                }))
            }
        });
    } catch (error) {
        logger.error('Time report error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



export const getCompletionReport: RequestHandler = async (req, res) => {
    try {
        const user = res.locals.user;
        if (!user) throw new AuthenticationError();

        const statusCounts = await db.query(`
            SELECT status, COUNT(*) as count
            FROM tasks
            WHERE "userId" = :userId
            GROUP BY status
        `, {
            replacements: { userId: user.id },
            type: QueryTypes.SELECT
        }) as Array<{ status: string, count: number }>;

        const totalTasks = statusCounts.reduce((acc, curr) => acc + Number(curr.count), 0);

        const statusDistribution = statusCounts.reduce((acc, { status, count }) => ({
            ...acc,
            [status]: {
                count: Number(count),
                percentage: ((Number(count) / totalTasks) * 100).toFixed(2) + '%'
            }
        }), {});

        return res.status(200).json({
            message: 'Completion report generated',
            report: {
                totalTasks,
                statusDistribution,
                completionRate: calculateCompletionRate(statusCounts)
            }
        });
    } catch (error) {
        logger.error('Completion report error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};




