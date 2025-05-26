import { FindOptions } from 'sequelize';

import { Task } from '../models';

import { BaseRepository } from './base';

export class TaskRepository extends BaseRepository<Task> {
    constructor() {
        super(Task);
    }


}
