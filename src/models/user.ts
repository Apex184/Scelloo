import { createId } from '@paralleldrive/cuid2';
import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';

import db from '../database';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare roleId: CreationOptional<string>;
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare password: string;
    declare isActive?: boolean;
    declare loginCount?: number;
    declare lastLoginDate?: Date;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate() {

    }
}

User.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: () => createId(),
            field: 'id',
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'firstName',
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'lastName',
        },
        roleId: { type: DataTypes.STRING, primaryKey: true },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'email',
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'password',
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: true,
            field: 'isActive',
        },
        loginCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true,
            field: 'loginCount',
        },
        lastLoginDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'lastLoginDate',
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'createdAt',
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'updatedAt',
        },
    },
    {
        sequelize: db,
        tableName: 'users',
        timestamps: true,
        underscored: false
    }
);