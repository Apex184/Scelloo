import './config/env'
import { logger } from './utils/logger';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { errorHandler, httpLogger } from './middleware';
import { NotFoundError } from './errors';
import { UserRoutes, TaskRoutes, AdminRoutes } from './routes';
import { env } from './config/env';

const app = express();

app.use(helmet());
app.use(httpLogger);
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', UserRoutes);
app.use('/api/tasks', TaskRoutes);
app.use('/api/admin', AdminRoutes);

app.use((req, _res, next) => {
    next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});
app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    process.exit(1);
});

export default app;