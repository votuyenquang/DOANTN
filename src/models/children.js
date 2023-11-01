'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Children extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Center, { foreignKey: 'center_id', as: 'center' });
      this.hasOne(models.Adropt_request,{foreignKey:'children_id',as:'adropt_request'})
    }
    
  }
  Children.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    } ,
    personalPicture: {
      type: DataTypes.STRING,
      allowNull: false,
    } ,
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    } ,
    
    gender:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    } ,
    age:{
      type: DataTypes.INTEGER,
      allowNull: true,
    } ,
    JoinDate:{
      type: DataTypes.DATE,
      allowNull: true,
    } , 
    center_id:{
      type: DataTypes.INTEGER,
      allowNull: true,
    } ,
  }, {
    sequelize,
    modelName: 'Children',
  });
  return Children;
};