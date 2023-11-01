'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Account, { foreignKey: 'account_id', as: 'account' });
      this.belongsTo(models.Activity, { foreignKey: 'activity_id', as: 'activity' });
    }
  }
  Notification.init({
    activity_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    account_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    message: DataTypes.STRING,
    status: {
      type:DataTypes.BOOLEAN,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};