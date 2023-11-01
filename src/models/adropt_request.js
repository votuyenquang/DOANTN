'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Adropt_request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Children,{foreignKey:'children_id',as:'children'})
      this.belongsTo(models.Adropt_detail, { foreignKey: 'adropt_detail_id', as: 'adropt_detail' });
    }
  }
  Adropt_request.init({
    
    
    children_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    request:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    adropt_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Adropt_request',
  });
  return Adropt_request;
};