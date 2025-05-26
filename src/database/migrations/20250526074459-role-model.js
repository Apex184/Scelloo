module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.STRING, primaryKey: true },
      roleName: {
        type: Sequelize.ENUM('admin', 'user'),
        allowNull: false,
        unique: true,
      },
      description: { type: Sequelize.STRING, allowNull: true },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('roles');
  },
};
