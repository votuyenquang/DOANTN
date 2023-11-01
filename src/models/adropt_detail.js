'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Adropt_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Account,{foreignKey:'account_id',as:'account'})
      this.hasMany(models.Adropt_request, { foreignKey: 'adropt_detail_id', as: 'Adropt_request' })
      this.hasMany(models.Proofs, { foreignKey: 'adropt_detail_id', as: 'Proofs' })

    }
  }
  Adropt_detail.init({
    income: {
      type: DataTypes.STRING,
      
    } ,
    marital_status:
    {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    family_status:
    {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    account_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Adropt_detail',
  });
  return Adropt_detail;
};