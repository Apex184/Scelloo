import { createId } from '@paralleldrive/cuid2';
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';
import { User } from './user';
import db from '../database';

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
    declare id: CreationOptional<string>;
    declare userId: string;
    declare title: string;
    declare description: string;
    declare status: TaskStatus;
    declare priority: TaskPriority;
    declare dueDate?: Date;
    declare completedAt?: Date;
    declare timeSpent: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate() {
        Task.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
}

Task.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: () => createId()
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'userId',
            references: {
                model: 'users',
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(TaskStatus)),
            allowNull: false,
            defaultValue: TaskStatus.TODO
        },
        priority: {
            type: DataTypes.ENUM(...Object.values(TaskPriority)),
            allowNull: false,
            defaultValue: TaskPriority.MEDIUM
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        completedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        timeSpent: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize: db,
        tableName: 'tasks',
        timestamps: true,
        underscored: false
    }
);