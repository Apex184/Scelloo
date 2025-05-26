import { createId } from '@paralleldrive/cuid2';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

import db from '../database';

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    declare id: CreationOptional<string>;
    declare roleName: string;
    declare description?: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Role.init(
    {
        id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => createId() },
        roleName: { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'user', field: 'roleName', },
        description: { type: DataTypes.STRING, allowNull: true, field: 'description' },
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
        tableName: 'roles',
    },
);
