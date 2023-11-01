'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Account, { foreignKey: 'role_id', as: 'account' })
    }
  }
  Role.init({
   
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
   {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};