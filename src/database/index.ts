import { Sequelize } from 'sequelize';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const db = new Sequelize(env.DATABASE_URL, {
    dialect: 'postgres',
    logging: env.SHOW_DATABASE_QUERIES ? console.log : false,
    pool: {
        max: env.DATABASE_MAX_POOL,
        min: env.DATABASE_MIN_POOL,
        acquire: 30000,
        idle: 10000,
    },
    define: {
        timestamps: true,
        underscored: true,
    },
});


(async () => {
    try {
        await db.authenticate();
        const dbName = db.getDatabaseName();
        logger.info(
            `[DATABASE STATUS ${new Date()}] - Connected to database: ${dbName} (${env.NODE_ENV ? 'development' : 'production'})`,
        );
    } catch (error) {
        logger.error(`[DATABASE ERROR ${new Date()}] - Unable to connect with the database:`, error);
    }
})();

export default db;
