'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Account, { foreignKey: 'account_id', as: 'account' });
      this.belongsTo(models.Activity, { foreignKey: 'activity_id', as: 'activity' });
    }
  }
  Comment.init({
    content:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activity_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Comment',

  });
  return Comment;
};