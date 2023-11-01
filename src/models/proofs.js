'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proofs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Adropt_detail, { foreignKey: 'adropt_detail_id', as: 'adropt_detail' });
    }
  }
  Proofs.init({
    Link: {
      type: DataTypes.STRING,
      allowNull: false,
    } ,
    adropt_detail_id:{
      type: DataTypes.INTEGER,
      allowNull: true,
    } ,
  }, {
    sequelize,
    modelName: 'Proofs',
  });
  return Proofs;
};