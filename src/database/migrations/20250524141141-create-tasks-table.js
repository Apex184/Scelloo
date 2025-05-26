'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('TODO', 'IN_PROGRESS', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'TODO',
      },
      priority: {
        type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH'),
        allowNull: false,
        defaultValue: 'MEDIUM',
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      timeSpent: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'userId',
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  }
};