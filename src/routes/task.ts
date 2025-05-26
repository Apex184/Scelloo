import { Router } from 'express';

import { validate, authenticate, adminOnly } from '../middleware';

import { createTask, getTasks, updateTask, deleteTask, getTimeReport, getCompletionReport } from '../controllers';
import { TaskSchema, UpdateTaskSchema } from '../input-validations';

const router = Router();

router.post('/', authenticate, validate(TaskSchema), createTask);
router.get('/time-report', authenticate, getTimeReport);
router.get('/report', authenticate, getCompletionReport);
router.get('/', authenticate, getTasks);
router.get('/:taskId', authenticate, getTasks);
router.patch('/:taskId', validate(UpdateTaskSchema), authenticate, updateTask);
router.delete('/:taskId', authenticate, deleteTask);

export const TaskRoutes = router;
