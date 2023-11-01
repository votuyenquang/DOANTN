'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Children', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      } ,
      personalPicture: {
        type: Sequelize.STRING,
        allowNull: false,
      } ,
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      } ,
      
      gender:{
        type: Sequelize.BOOLEAN,
        allowNull: true,
      } ,
      age:{
        type: Sequelize.INTEGER,
        allowNull: true,
      } ,
      JoinDate:{
        type: Sequelize.DATE,
        allowNull: true,
      } , 
      center_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('Children');
  }
};