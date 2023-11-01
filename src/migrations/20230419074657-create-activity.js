'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Activities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true,
      } ,
      title: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      } ,
      content: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      } ,
      contentHTML:{
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      
      center_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      } ,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Activities');
  }
};