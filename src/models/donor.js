'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Account, { foreignKey: 'account_id', as: 'account' });
      this.belongsTo(models.Center, { foreignKey: 'center_id', as: 'center' });
    }
  }
  Donor.init({
    center_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    } ,
    account_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      llowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    } ,
    
  }, {
    sequelize,
    modelName: 'Donor',
  });
  return Donor;
};