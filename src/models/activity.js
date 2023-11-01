'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Center, { foreignKey: 'center_id', as: 'center' });
      this.hasMany(models.Comment, { foreignKey: 'activity_id', as: 'comment' });
      this.hasMany(models.Like, { foreignKey: 'activity_id', as: 'like' });
      this.hasMany(models.Notification, { foreignKey: 'activity_id', as: 'notification' });

      
    }
  }
  Activity.init({

    title: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    } ,
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    } ,
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    } ,
    contentHTML:{
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    center_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    } ,
  }, {
    sequelize,
    modelName: 'Activity',
  });
  return Activity;
};