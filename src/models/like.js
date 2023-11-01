'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Activity, { foreignKey: 'activity_id', as: 'activity' });
      this.belongsTo(models.Account, { foreignKey: 'acount_id', as: 'account' });
    }
  }
  Like.init({
    acount_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activity_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};