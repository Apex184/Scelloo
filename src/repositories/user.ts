import { FindOptions } from 'sequelize';

import { User } from '../models';

import { BaseRepository } from './base';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(User);
    }

    async findByPk(id: string | number, options: FindOptions<User> = {}) {
        return super.findByPk(id, options);
    }

    async findByEmail(email: string, options: FindOptions<User> = {}) {
        return this.findOne({ email }, options);
    }



    async findUserById(userId: number | string, options: FindOptions<User> = {}) {
        return this.findByPk(userId, options);
    }
}
