// import { Router } from 'express';
// import { TaskController } from '../controllers/task.controller';
// import { authenticate } from '../middleware/auth';
// import { validate } from '../middleware/validate';
// import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../schemas/task.schema';

// const router = Router();

// router.use(authenticate);

// router.post('/', validate(createTaskSchema), TaskController.create);
// router.get('/', TaskController.getAll);
// // router.put('/:id', validate(updateTaskSchema), TaskController.update);
// // router.delete('/:id', validate(taskIdSchema), TaskController.delete);
// router.get('/report', TaskController.getReport);

// export default router; 