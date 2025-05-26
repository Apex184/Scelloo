import { WhereOptions } from 'sequelize';

import { Role } from '../models';

import { BaseRepository } from './base';

export class RoleRepository extends BaseRepository<Role> {
    constructor() {
        super(Role);
    }

    async findByName(roleName: string, options: { where?: WhereOptions<Role> } = {}): Promise<Role | null> {
        return this.findOne({ roleName }, options);
    }

    async findAllRoles(where: WhereOptions<Role> = {}): Promise<Role[]> {
        return this.findMany(where);
    }
}
